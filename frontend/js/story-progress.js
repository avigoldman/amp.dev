var COOKIE_AMP_EXP = 'AMP_EXP';
var AMP_STORY = 'amp-story';
var COOKIE_EXPIRY_TIME = 365; // one year

// Move story to the selected page
var pageId = getUrlParameter('id');
switchToPage(pageId);

function switchToPage(pageId) {
  if (!pageId) {
    return;
  }
  var story = document.querySelector('amp-story');
  story.addEventListener('ampstory:load', function() {
    var event = new CustomEvent('ampstory:switchpage',  {
      bubbles: true,
      detail: {
        targetPageId: pageId
      }
    });
    story.dispatchEvent(event);
  });
}

function getUrlParameter(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Enable story experiment
enableExperiment();

function enableExperiment() {
  var expCookie = getCookie(COOKIE_AMP_EXP);
  if (expCookie) {
    if (expCookie.indexOf(AMP_STORY) != -1) {
      return;
    } else {
      expCookie += encodeURIComponent(' ') + AMP_STORY;
    }
  } else {
    expCookie = AMP_STORY;
  }
  setCookie(COOKIE_AMP_EXP, expCookie, COOKIE_EXPIRY_TIME);
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
