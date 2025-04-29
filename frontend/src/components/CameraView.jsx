import React, { useMemo } from "react";

export default function CameraView({ frame }) {

  const imgSrc = frame.data.data_base64;

  if (!frame)
    return <div style={{ padding: 20, color: "#888" }}>No camera frame</div>;
  else
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          background: "#1a1a1a",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <img
          src={imgSrc}
          alt="Camera frame"
          style={{
            maxWidth: "100%",
            maxHeight: "32vh",
            borderRadius: 8,
            background: "#222",
          }}
        />
        <div style={{ color: "#b7cfff", marginTop: 8 }}>
          Time: {frame.timestamp?.toFixed(3)}
        </div>
      </div>
    );
}
