# Telegram 表情包转 QQ 表情包（.eif）Web 工具

一个支持 Web UI 的工具，帮助你将 Telegram 的自定义表情包（通过 @Stickerdownloadbot 获取的 zip 文件）一键转换为 QQ 可导入的 .eif 表情包。

## 功能
- 前端支持 zip 文件上传，自动调用后端转换
- 后端自动解压、格式转换、打包为 QQ .eif
- 支持多级目录、.webp/.png 格式

---

## 安装与运行

### 1. 克隆项目
```bash
git clone https://github.com/619dev/telegram2qq-eif.git
cd telegram2qq-eif
```

### 2. 安装后端依赖
```bash
cd backend
npm install
```

### 3. 启动后端服务
```bash
node index.js
```
默认监听 3001 端口。

### 4. 安装前端依赖
```bash
cd ../frontend
npm install
```

### 5. 启动前端服务
```bash
npm start
```
默认监听 3000 端口。

---

## 使用方法
1. 在 Telegram 搜索并启动 **@Stickerdownloadbot**
2. 发送表情包链接（如 `https://t.me/addstickers/ongeki`）给机器人
3. 下载机器人返回的 zip 文件
4. 打开本工具 Web 页面，上传 zip 文件，点击“开始转换”
5. 下载生成的 .eif 文件，导入 QQ

---

## 注意事项
- 仅支持通过 @Stickerdownloadbot 获取的 zip 文件
- zip 内表情支持 .webp/.png 格式，支持多级目录
- 生成的 .eif 文件可直接导入 QQ
- 本工具仅作学习与交流，勿用于商业用途

---

## 贡献
欢迎 issue、PR 和建议！

---

## License
MIT
