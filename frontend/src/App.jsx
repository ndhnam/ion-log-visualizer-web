import React, { useState, useEffect } from "react";
import IonFileDropzone from "./components/IonFileDropzone";
import KeyValueTable from "./components/KeyValueTable";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBotInfo, setShowBotInfo] = useState(false);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

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
        setJsonData(result);
      } else {
        setJsonData({ error: result.error });
      }
    } catch (err) {
      setJsonData({ error: err.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (jsonData?.topics && Array.isArray(jsonData.topics)) {
      setTopics(jsonData.topics);
      setSelectedTopic(
        jsonData.topics[0]?.topicName || jsonData.topics[0]?.topic_name || ""
      );
    }
  }, [jsonData]);

  const humanTopics = topics.filter(
    (t) =>
      !String(t.topicType || t.topic_type)
        .toLowerCase()
        .includes("compressed")
  );

  const currentTopic = humanTopics.find(
    (t) => (t.topicName || t.topic_name) === selectedTopic
  );

  const firstMsg = currentTopic?.messages?.[0];

  return (
    <div>
      <div className="upload-container">
        <form className="upload-form" onSubmit={handleUpload}>
          <div className="upload-row">
            <IonFileDropzone onFileSelected={setFile} file={file} />
            <button
              type="submit"
              className="upload-btn"
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload & Parse"}
            </button>
          </div>
        </form>
      </div>
      <div className="main-3col-row">
        <div className="left-panel data-container">
          <div className="accordion-block">
            {/* Dropdown/Accordion Button */}
            <button
              className="dropdown-btn"
              onClick={() => setShowSessionInfo((prev) => !prev)}
            >
              Session Information
              <span>
                {showSessionInfo ? "▼" : "▶"} {/* Icon change direction */}
              </span>
            </button>
            {jsonData && jsonData.metadata.sessionInfo && (
              <div>
                {showSessionInfo && (
                  <KeyValueTable data={jsonData.metadata.sessionInfo} />
                )}
              </div>
            )}

            {/* Dropdown/Accordion Button */}
            <button
              className="dropdown-btn"
              onClick={() => setShowBotInfo((prev) => !prev)}
            >
              {jsonData &&
              jsonData.metadata.botInfo &&
              jsonData.metadata.botInfo.botName
                ? jsonData.metadata.botInfo.botName
                : "Bot Info"}
              <span>
                {showBotInfo ? "▼" : "▶"} {/* Icon change direction */}
              </span>
            </button>
            {jsonData && jsonData.metadata.botInfo && (
              <div>
                {showBotInfo && (
                  <KeyValueTable data={jsonData.metadata.botInfo} />
                )}
              </div>
            )}

            {/* Dropdown/Accordion Button */}
            <button
              className="dropdown-btn"
              onClick={() => setShowBotConfig((prev) => !prev)}
            >
              Bot Configuration
              <span>
                {showBotConfig ? "▼" : "▶"} {/* Icon change direction */}
              </span>
            </button>
            {jsonData && jsonData.metadata.botConfig && (
              <div>
                {showBotConfig && (
                  <KeyValueTable data={jsonData.metadata.botConfig} />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="middle-panel  topic-select-container">
          <div className="topic-select-block">
            <label
              htmlFor="topic-select"
              style={{ fontWeight: 500, marginRight: 8 }}
            >
              Select topic
            </label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="topic-select"
            >
              {humanTopics.map((topic) => (
                <option
                  key={topic.topicName || topic.topic_name}
                  value={topic.topicName || topic.topic_name}
                >
                  {topic.topicName || topic.topic_name}
                </option>
              ))}
            </select>
            <div style={{ fontWeight: 500, margin: "16px 0 6px 0" }}>
              Message Data
            </div>
            {currentTopic && (
              <div className="message-block">
                {firstMsg ? (
                  <pre className="message-data">
                    {JSON.stringify(firstMsg.data || firstMsg, null, 2)}
                  </pre>
                ) : (
                  <span style={{ color: "#888" }}>
                    No message data found for this topic.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          {/* Có thể để trống, hoặc thêm các panel về sau */}
        </div>
      </div>
    </div>
  );
}

export default App;
