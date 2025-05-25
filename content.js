// 1. Get current YouTube video ID
function getVideoId() {
  return new URLSearchParams(window.location.search).get('v');
}

// 2. Send video ID to background script
chrome.runtime.sendMessage({
  type: "NEW_VIDEO",
  videoId: getVideoId()
});

// 3. Receive emotion data and render
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "EMOTION_DATA") {
    renderEmotionOverlay(request.data);
  }
});

function renderEmotionOverlay(data) {
  // Remove old overlay if exists
  document.querySelectorAll('.emoji-overlay').forEach(el => el.remove());

  const timeline = document.querySelector('.ytp-progress-bar');
  if (!timeline) return;

  const overlay = document.createElement('div');
  overlay.className = 'emoji-overlay';

  data.emotions.forEach(item => {
    const marker = document.createElement('div');
    marker.className = 'emoji-marker';
    marker.textContent = getEmoji(item[1]);
    console.log(`Adding marker for emotion: ${item[0]} at timestamp: ${item[1]}`);
    console.log(`Video duration: ${getVideoDuration()}`);
    marker.style.left = `${(item[0] / getVideoDuration()) * 100}%`;
    overlay.appendChild(marker);
  });

  timeline.parentNode.appendChild(overlay);
}

function getVideoDuration() {
  return document.querySelector('video')?.duration || 0;
}

function getEmoji(emotion) {
  const emojis = {
    joy: '😂',
    anger: '😠',
    surprise: '😲',
    fear: '😨',
    sadness: '😢'
  };
  return emojis[emotion] || '❓';
}