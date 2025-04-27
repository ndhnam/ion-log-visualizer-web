import React, { useState, useEffect, useRef } from "react";
import IonFileDropzone from "./components/IonFileDropzone";
import KeyValueTable from "./components/KeyValueTable";
import "./App.css";
import PlaybackControl from "./components/PlaybackControl";
import { formatTime } from "./utils/formatTime";

function App() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBotInfo, setShowBotInfo] = useState(false);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);

  const intervalRef = useRef();

  // Console log
  const [consoleSearch, setConsoleSearch] = useState("");
  const logConsoleRef = useRef(null);

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

  // // playback - duration và current message
  const messages = currentTopic?.messages || [];

  // Chỉ lấy timestamp của message cuối cùng ở mỗi topic
  const lastTimestamps = topics
    .map((t) => {
      const msgs = t.messages || [];
      return msgs.length > 0 ? msgs[msgs.length - 1].timestamp : undefined;
    })
    .filter((ts) => typeof ts === "number");

  const firstTimestamps = topics
    .map((t) => {
      const msgs = t.messages || [];
      return msgs.length > 0 ? msgs[0].timestamp : undefined;
    })
    .filter((ts) => typeof ts === "number" && ts > 0);

  // duration là (max last timestamp) - (min first timestamp)
  const minTimestamp =
    firstTimestamps.length > 0 ? Math.min(...firstTimestamps) : 0;
  const maxTimestamp =
    lastTimestamps.length > 0 ? Math.max(...lastTimestamps) : 0;
  const duration = maxTimestamp - minTimestamp;

  // playbackTime luôn là minTimestamp + currentTime
  const playbackTime = minTimestamp + currentTime;

  const currentMsg = messages.find(
    (m, i) => m.timestamp >= playbackTime || i === messages.length - 1
  );

  // Auto play timer
  useEffect(() => {
    if (isPlaying && duration > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev + 50 * speed >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 50 * speed;
        });
      }, 50);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration, speed]);

  // Console log
  const rosoutTopic = topics.find(
    (t) => (t.topicName || t.topic_name) === "/rosout_agg"
  );
  const rosoutMessages = rosoutTopic?.messages || [];

  const displayedRosoutMessages = rosoutMessages.filter(
    (msg) => msg.timestamp <= playbackTime
  );

  const filteredRosoutMessages = displayedRosoutMessages.filter(
    (msg) =>
      !consoleSearch ||
      (msg.data &&
        JSON.stringify(msg.data)
          .toLowerCase()
          .includes(consoleSearch.toLowerCase()))
  );

  useEffect(() => {
    if (logConsoleRef.current) {
      logConsoleRef.current.scrollTop = logConsoleRef.current.scrollHeight;
    }
  }, [filteredRosoutMessages]);

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

      <PlaybackControl
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={() => setIsPlaying((p) => !p)}
        onSeek={(t) => setCurrentTime(t)}
        speed={speed}
        onSpeedChange={setSpeed}
      />

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
                {currentMsg ? (
                  <pre className="message-data">
                    {JSON.stringify(currentMsg.data || currentMsg, null, 2)}
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
          <div className="log-console-block">
            <div className="log-console-header">
              <span style={{ fontWeight: 500 }}>Log Console (/rosout_agg)</span>
              <input
                type="text"
                className="log-console-search"
                value={consoleSearch}
                onChange={(e) => setConsoleSearch(e.target.value)}
                placeholder="Search logs..."
                style={{ marginLeft: "12px" }}
              />
            </div>
            <div className="log-console-content" ref={logConsoleRef}>
              {filteredRosoutMessages.length > 0 ? (
                filteredRosoutMessages.map((msg, i) => (
                  <div key={i} className="log-console-line">
                    <span className="log-console-timestamp">
                      {formatTime(msg.timestamp - minTimestamp)}
                    </span>{" "}
                    {msg.data && msg.data.msg
                      ? msg.data.msg
                      : JSON.stringify(msg.data)}
                  </div>
                ))
              ) : (
                <div className="log-console-empty">No log message.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
