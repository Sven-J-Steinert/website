function togglebg() {
  launchAni();
  var bgimg = document.getElementById('bgimg');
  bgimg.classList.toggle('fade');
}

// Check if the device is a mobile phone
function isMobileDevice() {
  return /Mobi/i.test(navigator.userAgent);
}

// Function to disable scrolling on mobile devices
function disableScrollOnMobile() {
  if (isMobileDevice()) {
    document.body.style.overflow = "hidden";
  }
}

// Call the function to disable scrolling on mobile devices
disableScrollOnMobile();
