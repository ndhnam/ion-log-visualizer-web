import React, { useState } from "react";
import IonFileDropzone from "./components/IonFileDropzone";
import KeyValueTable from "./components/KeyValueTable";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBotInfo, setShowBotInfo] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setJsonData(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setJsonData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload-ion", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setJsonData(result.data);
      } else {
        setJsonData({ error: result.error });
      }
    } catch (err) {
      setJsonData({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="upload-container">
        <form className="upload-form" onSubmit={handleUpload}>
          <IonFileDropzone onFileSelected={setFile} file={file} />
          <button
            type="submit"
            className="upload-btn"
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Upload & Parse"}
          </button>
        </form>
      </div>
      <div className="data-container">
        {jsonData && jsonData.botInfo && (
          <div>
            {/* Dropdown/Accordion Button */}
            <button
              className="dropdown-btn"
              onClick={() => setShowBotInfo((prev) => !prev)}
            >
              Bot Info
              <span>
                {showBotInfo ? "▼" : "▶"} {/* Icon đổi chiều */}
              </span>              
            </button>
            {showBotInfo && (
              <KeyValueTable data={jsonData.botInfo} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;