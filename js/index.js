window.addEventListener('load', function () {
  // Event listeners
  document.getElementById("email-to-clipboard").addEventListener('click', copyToClipboard);
  document.getElementById("email-to-clipboard").addEventListener('mouseover', () => {
    showClipboardAction(true);
  });
  document.getElementById("email-to-clipboard").addEventListener('mouseout', () => {
    showClipboardAction(false);
  });

  document.getElementById("work-popup").addEventListener('click', () => {
    showWorkContent(true);
  });
  document.getElementById("work-popup").addEventListener('mouseover', (e) => {
    showPopupAction(e, true);
  });  
  document.getElementById("work-popup").addEventListener('mouseout', (e) => {
    showPopupAction(e, false);
  });  

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

  document.getElementById("on-clipboard").style.visibility = 'visible';
  setTimeout(function() {
    document.getElementById("on-clipboard").style.visibility = 'hidden';
  }, 2000);
} 

function showClipboardAction(show) {
  if(show) {
    document.getElementById("clipboard-action").style.visibility = 'visible';
  } else {
    document.getElementById("clipboard-action").style.visibility = 'hidden';
  }
}

function showWorkContent(show) {
  if(show) {
    document.getElementById("work-content").style.visibility = 'visible';
    setTimeout(function() {
      document.getElementById("work-content").style.visibility = 'hidden';
    }, 60000);

    document.getElementById("click-to-close").style.visibility = 'visible';
    setTimeout(function() {
      document.getElementById("click-to-close").style.visibility = 'hidden';
    }, 3000);
  } else {
    document.getElementById("click-to-close").style.visibility = 'hidden';
    document.getElementById("work-content").style.visibility = 'hidden';
  }
}

function showPopupAction(e, show) {
  if(show) {
    x = e.clientX;
    y = e.clientY;

    document.getElementById("popup-action").style.top = (y+20).toString().concat("px");
    document.getElementById("popup-action").style.left = (x+20).toString().concat("px");
    document.getElementById("popup-action").style.visibility = 'visible';
  } else {
    document.getElementById("popup-action").style.visibility = 'hidden';
  }
}
