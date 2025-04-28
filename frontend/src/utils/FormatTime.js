// format seconds to mm:ss.mmm
export function formatTime(t) {
  const seconds = Math.floor(t / 1000);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor(t % 1000);
  return `${minutes}:${secs.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(3, "0")}`;
}
