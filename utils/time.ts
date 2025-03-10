export const formatTime = (hours: number, minutes: number) =>
  `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
