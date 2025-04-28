import React from "react";
import "./PlaybackControl.css";
import { formatTime } from "../utils/FormatTime";

export default function PlaybackControl({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  speed,
  onSpeedChange
}) {
  return (
    <div className="playback-row">
      <button className="play-btn" onClick={onPlayPause}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <span className="playback-time">{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        step={0.01}
        onChange={e => onSeek(Number(e.target.value))}
        className="playback-seeker"
      />
      <span className="playback-time">{formatTime(duration)}</span>
      <select
        className="playback-speed"
        value={speed}
        onChange={e => onSpeedChange(Number(e.target.value))}
      >
        <option value={0.5}>0.5x</option>
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={5}>5x</option>
      </select>
    </div>
  );
}
