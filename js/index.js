window.addEventListener('load', function () {
  startClock();
  jsonSiteDataInject();
})

async function startClock() {
  setInterval(function() {
    const time = new Date();
    document.getElementById('doy').innerHTML = time.toDateString();
    document.getElementById('tod').innerHTML = time.toLocaleTimeString("en-US", {hourCycle: 'h23'});
  }, 1000);

}

async function jsonSiteDataInject() {
  const response = await fetch('https://yveshoebeke.github.io/data/yveshoebeke.github.io.json');
  const jsonData = await response.json();
  const time = new Date();
    
  document.getElementById("email").innerHTML = jsonData.email;
  document.getElementById("version").innerHTML = jsonData.version;
  document.getElementById("copy-year").innerHTML = time.getFullYear();
  document.getElementById("copy-name").innerHTML = jsonData.author;
 }

function copyToClipboard() {
  content = document.getElementById("email").innerHTML;
  navigator.clipboard.writeText(content);

  document.getElementById("onClipboard").style.visibility = 'visible';
  setTimeout(function() {
    document.getElementById("onClipboard").style.visibility = 'hidden';
  }, 2000);
} 

function showClipboardAction(show) {
  if(show) {
    document.getElementById("clipboardAction").style.visibility = 'visible';
  } else {
    document.getElementById("clipboardAction").style.visibility = 'hidden';
  }
}

function showWorkContent(show) {
      if(show) {
        document.getElementById("work-content").style.visibility = 'visible';
        setTimeout(function() {
          document.getElementById("work-content").style.visibility = 'hidden';
        }, 60000);

        document.getElementById("clickToClose").style.visibility = 'visible';
        setTimeout(function() {
          document.getElementById("clickToClose").style.visibility = 'hidden';
        }, 3000);
      } else {
        document.getElementById("work-content").style.visibility = 'hidden';
  }
}
