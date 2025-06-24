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

  const timeline = document.querySelector('.ytp-chrome-bottom');
  if (!timeline) return;

  const overlay = document.createElement('div');
  overlay.className = 'emoji-overlay';

  data.emotions.forEach(item => {
    const [timestamp, emotion, commentText] = item;
    const emojiData = getEmojiData(emotion);

    const card = document.createElement('div');
    card.className = 'emoji-card';

    // Create emoji container
    const emojiContainer = document.createElement('div');
    emojiContainer.className = 'emoji-container';
    const emojiElement = document.createElement('span');
    emojiElement.className = 'emoji';
    emojiElement.textContent = emojiData['emoji'];
    emojiContainer.appendChild(emojiElement);

    // Create description
    const descElement = document.createElement('p');
    descElement.className = 'emoji-description';
    descElement.textContent = emojiData['name'];
    
    // Create footer with timestamp and comment
    const footer = document.createElement('div');
    footer.className = 'emoji-footer';
    const commentElement = document.createElement('span');
    // const timestampSpanElement = document.createElement('span');
    // const timestampElement = document.createElement('a');
    // timestampElement.className = 'yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color';
    // timestampElement.textContent = timestamp;
    // timestampElement.href = `/watch?v=${getVideoId()}&t=${timestamp}s`;
    // timestampSpanElement.appendChild(timestampElement);
    // commentElement.appendChild(timestampSpanElement);
    commentElement.className = 'comment';
    commentElement.textContent = commentText;
    footer.appendChild(commentElement);

    card.appendChild(footer);
    card.appendChild(descElement);
    card.appendChild(emojiContainer);

    console.log(`Adding marker for emotion: ${emotion} at timestamp: ${timestamp}`);
    console.log(`Video duration: ${getVideoDuration()}`);

    card.style.left = `${(timestamp / getVideoDuration()) * 100}%`;
    overlay.appendChild(card);
  });

  timeline.appendChild(overlay);
}

function getVideoDuration() {
  return document.querySelector('video')?.duration || 0;
}

function getEmojiData(emotion) {
  const emojiData = {
    'admiration': { emoji: '😍', name: 'восхищение' },
    'amusement': { emoji: '😄', name: 'веселье' },
    'anger': { emoji: '😠', name: 'злость' },
    'annoyance': { emoji: '😒', name: 'раздражение' },
    'approval': { emoji: '👍', name: 'одобрение' },
    'caring': { emoji: '🤗', name: 'забота' },
    'confusion': { emoji: '😕', name: 'непонимание' },
    'curiosity': { emoji: '🤔', name: 'любопытство' },
    'desire': { emoji: '😏', name: 'желание' },
    'disappointment': { emoji: '😞', name: 'разочарование' },
    'disapproval': { emoji: '👎', name: 'неодобрение' },
    'disgust': { emoji: '🤢', name: 'отвращение' },
    'embarrassment': { emoji: '😳', name: 'смущение' },
    'excitement': { emoji: '🤩', name: 'возбуждение' },
    'fear': { emoji: '😨', name: 'страх' },
    'gratitude': { emoji: '🙏', name: 'признательность' },
    'grief': { emoji: '😢', name: 'горе' },
    'joy': { emoji: '😂', name: 'радость' },
    'love': { emoji: '❤️', name: 'любовь' },
    'nervousness': { emoji: '😬', name: 'нервозность' },
    'optimism': { emoji: '😊', name: 'оптимизм' },
    'pride': { emoji: '🦁', name: 'гордость' },
    'realization': { emoji: '💡', name: 'осознание' },
    'relief': { emoji: '😌', name: 'облегчение' },
    'remorse': { emoji: '😔', name: 'раскаяние' },
    'sadness': { emoji: '😭', name: 'грусть' },
    'surprise': { emoji: '😲', name: 'удивление' },
    'neutral': { emoji: '😐', name: 'нейтральность' }
  };
  return emojiData[emotion] || { emoji: '❓', name: 'неизвестно' };
}