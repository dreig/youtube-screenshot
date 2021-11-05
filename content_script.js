var loggingEnabled = false;
var initCalled = false;

// Take screenshot
captureScreenshot = function () {
  logger("Capturing screenshot");
  var canvas = document.createElement("canvas");
  var video = document.querySelector("video");
  var ctx = canvas.getContext("2d");
  canvas.width = parseInt(video.style.width);
  canvas.height = parseInt(video.style.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  sendRequest(canvas);
};

var WEBHOOK_URL = "https://discord.com/api/webhooks/<token>"

sendRequest = function(canvas) {
  logger("Posting screenshot");
  let file = null;
  let fileName = getFileName();
  canvas.toBlob(function(blob) {
    file = new File([blob], fileName, { type: 'image/jpeg' });

    let formData = new FormData();
    formData.append("pic", file);
    fetch(WEBHOOK_URL, {method: "POST", body: formData});
  }, 'image/jpeg');
}

downloadFile = function (canvas) {
  var aClass = "youtube-screenshot-a";
  var a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg");
  a.download = getFileName();
  a.style.display = "none";
  a.classList.add(aClass);
  document.body.appendChild(a);
  document.querySelector(`.${aClass}`).click();
  document.body.removeChild(a);
};

getFileName = function () {
  seconds = document.getElementsByClassName("video-stream")[0].currentTime;
  seconds = parseInt(seconds);

  return `video_${seconds}.jpeg`;
};

addButtonOnYoutubePlayer = function () {
  logger("Adding screenshot button");
  var btn = document.createElement("button");
  let svgHTML = "<svg class=\"ytp-subtitles-button-icon\" fill=\"#fff\" xmlns=\"http://www.w3.org/2000/svg\"  viewBox=\"0 0 36 36\" width=\"100%\" height=\"100%\" style=\"margin: 6px 8px;\"><path d=\"M 10.441406 3 C 9.1537708 3 8.002646 3.8304098 7.5957031 5.0527344 L 7.2792969 6 L 4 6 C 2.9069372 6 2 6.9069372 2 8 L 2 19 C 2 20.093063 2.9069372 21 4 21 L 20 21 C 21.093063 21 22 20.093063 22 19 L 22 8 C 22 6.9069372 21.093063 6 20 6 L 16.720703 6 L 16.404297 5.0527344 C 15.997586 3.8311067 14.846229 3 13.558594 3 L 10.441406 3 z M 10.441406 5 L 13.558594 5 C 13.992958 5 14.370523 5.2712214 14.507812 5.6835938 L 15.279297 8 L 20 8 L 20 19 L 4 19 L 4 8 L 8.7207031 8 L 9.4921875 5.6835938 C 9.6292447 5.2719183 10.007042 5 10.441406 5 z M 12 9 C 9.8026661 9 8 10.802666 8 13 C 8 15.197334 9.8026661 17 12 17 C 14.197334 17 16 15.197334 16 13 C 16 10.802666 14.197334 9 12 9 z M 12 11 C 13.116666 11 14 11.883334 14 13 C 14 14.116666 13.116666 15 12 15 C 10.883334 15 10 14.116666 10 13 C 10 11.883334 10.883334 11 12 11 z\"/></svg>"
  btn.innerHTML = svgHTML;
  btn.classList.add("ytp-time-display");
  btn.classList.add("ytp-button");
  btn.classList.add("ytp-screenshot");

  var youtubeRightButtonsDiv = document.querySelector(".ytp-right-controls");
  youtubeRightButtonsDiv.insertBefore(btn, youtubeRightButtonsDiv.firstChild);
};

addEventListener = function () {
  logger("Adding button event listener");
  var youtubeScreenshotButton = document.querySelector(".ytp-screenshot");
  youtubeScreenshotButton.removeEventListener("click", captureScreenshot);
  youtubeScreenshotButton.addEventListener("click", captureScreenshot);
};


keyEventListener = function (ev) {
  if (document.activeElement.contentEditable === 'true' ||
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.contentEditable === 'plaintext')
    return true;

  if (ev.shiftKey && ev.keyCode == 83) { // Shift + S
    ev.preventDefault();
    captureScreenshot();
    return false;
  }

  return true;
}

logger = function (message) {
  if (loggingEnabled) {
    console.log(`Youtube Screenshot Addon: ${message}`);
  }
};

init = function () {
  if (initCalled) {
    console.log("NOT SETTING");
    return;
  }

  console.log("SETTING");
  initCalled = true;
  // Initialization
  var storageItem = browser.storage.local.get();
  storageItem.then((result) => {
    if (result.YouTubeScreenshotAddonisDebugModeOn) {
      logger("Addon initializing!");
      loggingEnabled = true;
    }
    addButtonOnYoutubePlayer();
    addEventListener();
    document.addEventListener('keydown', keyEventListener);
  });
};

init();
