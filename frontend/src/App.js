import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl("");
    setError("");
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setDownloadUrl("");
    const formData = new FormData();
    formData.append("zip", file);

    try {
      const res = await fetch("http://localhost:3001/api/convert", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setDownloadUrl("http://localhost:3001" + data.url);
      } else {
        setError(data.error || "转换失败");
      }
    } catch (e) {
      setError("网络错误或后端未启动");
    }
    setLoading(false);
  };

  return (
    <div className="App" style={{ maxWidth: 500, margin: "60px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Telegram 表情包转 QQ .eif</h2>
      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />
      <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
        请用 <b>@Stickerdownloadbot</b> 获取 Telegram 表情包的 zip 文件，并上传到此处。<br />
        1. 在 Telegram 搜索并启动 <b>@Stickerdownloadbot</b><br />
        2. 发送表情包链接（如 https://t.me/addstickers/ongeki）<br />
        3. 下载机器人返回的 zip 文件，上传到上方
      </div>
      <button
        onClick={handleConvert}
        disabled={!file || loading}
        style={{ width: "100%", padding: 12, fontSize: 16, background: "#1677ff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        {loading ? "转换中..." : "开始转换"}
      </button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {downloadUrl && (
        <div style={{ marginTop: 24 }}>
          <a
            href={downloadUrl}
            download
            style={{ color: "#1677ff", fontWeight: "bold", fontSize: 18 }}
          >
            下载 QQ 表情包 (.eif)
          </a>
        </div>
      )}
    </div>
  );
}

export default App;