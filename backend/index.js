const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const sharp = require('sharp');
const archiver = require('archiver');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

const upload = multer({ dest: 'uploads/' });

// 递归查找所有 .webp/.png 文件
function getAllImageFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImageFiles(filePath));
    } else if (file.endsWith('.webp') || file.endsWith('.png')) {
      results.push(filePath);
    }
  });
  return results;
}

// 工具函数：生成 QQ info.json
function generateInfoJson(emojis) {
  return JSON.stringify({
    emojis: emojis.map((e, i) => ({
      name: `表情${i + 1}`,
      file: e,
    })),
    desc: '由 Telegram 导出',
    source: 'telegram2qq-eif',
    version: 1,
  }, null, 2);
}

// 主接口：接收 zip 文件上传
app.post('/api/convert', upload.single('zip'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '缺少 zip 文件' });

  const id = Date.now();
  const workDir = path.join(__dirname, 'tmp', String(id));
  const outDir = path.join(__dirname, 'downloads');
  const zipPath = req.file.path;
  const emojiDir = path.join(workDir, 'emojis');
  const eifName = `tg2qq_${id}.eif`;
  const eifPath = path.join(outDir, eifName);

  try {
    fs.mkdirSync(workDir, { recursive: true });
    fs.mkdirSync(emojiDir, { recursive: true });
    fs.mkdirSync(outDir, { recursive: true });

    // 解压
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: emojiDir }))
      .promise();

    // 递归查找所有图片
    const imageFiles = getAllImageFiles(emojiDir);
    if (imageFiles.length === 0) {
      return res.status(400).json({ error: 'zip 文件中未找到表情图片' });
    }

    const outFiles = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const dst = path.join(emojiDir, `emoji_${i + 1}.png`);
      await sharp(imageFiles[i]).png().toFile(dst);
      outFiles.push(`emoji_${i + 1}.png`);
    }

    // 生成 info.json
    const infoJson = generateInfoJson(outFiles);
    fs.writeFileSync(path.join(emojiDir, 'info.json'), infoJson);

    // 打包为 .eif (zip)
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(eifPath);
      const archive = archiver('zip');
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      outFiles.forEach(f => {
        archive.file(path.join(emojiDir, f), { name: f });
      });
      archive.file(path.join(emojiDir, 'info.json'), { name: 'info.json' });
      archive.finalize();
    });

    // 返回下载链接
    res.json({ url: `/downloads/${eifName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '处理失败', detail: err.message });
  } finally {
    // 清理临时文件（可选）
    // fs.rmSync(workDir, { recursive: true, force: true });
    fs.unlinkSync(zipPath); // 删除上传的 zip 文件
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});