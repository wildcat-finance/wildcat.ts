function clearLines(n) {
  for (let i = 0; i < n; i++) {
    process.stdout.moveCursor(0, i === 0 ? 0 : -1);
    process.stdout.clearLine(1);
  }
  process.stdout.cursorTo(0);
}
// let didWriteLine = false;
let lastMessage = undefined;

function clearLastMessage() {
  if (lastMessage) {
    clearLines(lastMessage.split("\n").length);
  }
  lastMessage = undefined;
}

function updateLog(str) {
  clearLastMessage();
  process.stdout.write(str);
  lastMessage = str;
}
function stopUpdatingLog() {
  process.stdout.write("\n");
}

const getProgressBar = (label, total) => {
  let lastPercentComplete = 0;
  let i = 0;
  const update = () => {
    const current = ++i;
    const percent = Math.floor((current * 100) / total);
    if (percent === lastPercentComplete) return;
    lastPercentComplete = percent;
    const progressBar =
      Array(Math.floor(percent / 2))
        .fill("=")
        .join("") + (percent < 100 ? ">" : "");
    const message = `${label}: ${progressBar.padEnd(50)} ${percent}%`;
    updateLog(message);
    if (percent === 100) stopUpdatingLog();
  };
  return update;
};

module.exports = {
  clearLines,
  clearLastMessage,
  updateLog,
  stopUpdatingLog,
  getProgressBar
};

const waitMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let count = 1000;
const updateProgress = getProgressBar("Progress", count);
async function test() {
  for (let i = 0; i < count; i++) {
    await waitMs(10);
    updateProgress(i);
  }
}
// test();
