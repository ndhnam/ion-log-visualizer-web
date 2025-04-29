export function getOdomAtTime(odomMessages, playbackTime) {
  if (!odomMessages || !odomMessages.length) return null;
  // Giả sử messages đã SORTED tăng dần theo timestamp
  for (let i = 0; i < odomMessages.length; ++i) {
    if (odomMessages[i].timestamp >= playbackTime) {
      return odomMessages[i];
    }
  }
  return odomMessages[odomMessages.length - 1];
}
