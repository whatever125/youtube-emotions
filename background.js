chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NEW_VIDEO") {
    fetch(`http://localhost:8000/analyze?video_id=${request.videoId}`)
      .then(response => response.json())
      .then(data => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "EMOTION_DATA",
            data: data
          });
        });
      });
  }
});