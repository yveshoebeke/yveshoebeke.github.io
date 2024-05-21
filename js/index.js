window.addEventListener('load', function () {
  // Event listeners:
  //  - email to clipboard.
  document.getElementById("email-to-clipboard").addEventListener('click', (e) => { 
    copyToClipboard(e, 'email');
  });
  //  - pgp key to clipboard.
  document.getElementById("pgp-to-clipboard").addEventListener('click', (e) => { 
    copyToClipboard(e, 'pgp');
  });

  //  - show intent popup.
  for (obj of this.document.getElementsByClassName("to-clipboard")){
    obj.addEventListener('mouseover', (e) => {
      showClipboardAction(e, true);
    });
    obj.addEventListener('mouseout', (e) => {
      showClipboardAction(e, false);
    });
  };

  //  - show work done + intent popup.
  document.getElementById("work-popup").addEventListener('click', () => {
    showWorkContent(true);
  });
  document.getElementById("work-popup").addEventListener('mouseover', (e) => {
    showPopupAction(e, true);
  });  
  document.getElementById("work-popup").addEventListener('mouseout', (e) => {
    showPopupAction(e, false);
  });  

  //  - close work done by clicking anywhere in the <div>.
  document.getElementById("work-content").addEventListener('click', () => {
    showWorkContent(false);
  });

  // Start day/time clock
  startClock();
  // Read json to display some data.
  jsonSiteDataInject();
  // count up the years...
  countUp();
})

// Clock - tik tok...
async function startClock() {
  setInterval(() => {
    const time = new Date();
    document.getElementById('doy').innerHTML = time.toDateString();
    document.getElementById('tod').innerHTML = time.toLocaleTimeString("en-US", {hourCycle: 'h23'});
  }, 1000);

}

// Read json file and insert in appropriate HTML locations
async function jsonSiteDataInject() {
  await fetch('data/yveshoebeke.github.io.json')
  .then((response) => response.json())
  .then((jsonResponse) => {
    // email, author, version and (c) year insertion.
    const time = new Date();
    document.getElementById("copy-year").innerHTML = time.getFullYear();
    document.getElementById("email").innerHTML = jsonResponse.email;
    document.getElementById("version").innerHTML = jsonResponse.version;
    document.getElementById("copy-name").innerHTML = jsonResponse.author;

    // - Work samples <div> content construction as follows:
    //
    //    <ul>
    //      <li>            --> Co. name + location
    //        <ul>
    //          <li>        --> Application(s)
    //          <li>        --> Technologies used
    //
    const workUl = document.getElementById("work-content-detail")
    jsonResponse.worksamples.forEach((obj) => {
      const companyLi = document.createElement("li");
      companyLi.classList.add("company");
      const companyName = document.createTextNode(obj.company.concat(" - ").concat(obj.location));
      companyLi.appendChild(companyName);
      workUl.appendChild(companyLi);

        const companyLu = document.createElement("ul");

          const companyApplicationLi = document.createElement("li");
          const companyApplicationDescription = document.createTextNode(obj.application);
          companyApplicationLi.appendChild(companyApplicationDescription);

          const companyTechnologiesLi = document.createElement("li")
          const companyTechnologiesDescription = document.createTextNode(obj.technologies);
          companyTechnologiesLi.appendChild(companyTechnologiesDescription);

        companyLu.appendChild(companyApplicationLi);
        companyLu.appendChild(companyTechnologiesLi);

      workUl.appendChild(companyLu);
    })
  })
  .catch((e) => console.error(e));
}

// Copy content (email or pgp key) to clipboard.
async function copyToClipboard(e, spanId) {
  showClipboardAction(null, false);

  // - pgp key read from file, email from <span> content.
  if(spanId == "pgp") {
    await fetch('data/pgp.pub')
    .then((res) => res.text())
    .then((text) => {
      navigator.clipboard.writeText(text);
    })
    .catch((e) => console.error(e));
  } else if(spanId == "email") {
    content = document.getElementById(spanId).innerHTML;
    navigator.clipboard.writeText(content);
  }

  x = e.clientX;
  y = e.clientY;

  document.getElementById("on-clipboard").style.top = (y-35).toString().concat("px");
  document.getElementById("on-clipboard").style.left = (x+10).toString().concat("px");
  document.getElementById("on-clipboard").style.visibility = 'visible';
  setTimeout(function() {
    document.getElementById("on-clipboard").style.visibility = 'hidden';
  }, 2000);
} 

// Clipboard intent popup.
function showClipboardAction(e, show) {
  if(show) {
    x = e.clientX;
    y = e.clientY;

    document.getElementById("clipboard-action").style.top = (y-35).toString().concat("px");
    document.getElementById("clipboard-action").style.left = (x+10).toString().concat("px");
    document.getElementById("clipboard-action").style.visibility = 'visible';
  } else {
    document.getElementById("clipboard-action").style.visibility = 'hidden';
  }
}

// Work <div> display control.
var intervalId = 0;
function showWorkContent(show) {
  if(show) {
    showPopupAction(null, false)
    document.getElementById("work-content").style.visibility = 'visible';

    // - toggle click-to-close message on/off at 3 sec.
    var showOnOff = 'hidden';
    intervalId = setInterval(() => {
      showOnOff = (showOnOff == 'hidden')?'visible':'hidden';
      document.getElementById("click-to-close").style.visibility = showOnOff;
    }, 3000);
 
    // - Close work <div> after 1 minute.
    setTimeout(() => {
      clearInterval(intervalId);
      document.getElementById("work-content").style.visibility = 'hidden';
    }, 60000);
 } else {
    clearInterval(intervalId);
    document.getElementById("click-to-close").style.visibility = 'hidden';
    document.getElementById("work-content").style.visibility = 'hidden';
  }
}

// Show action 'submitted'.
function showPopupAction(e, show) {
  if(show) {
    x = e.clientX;
    y = e.clientY;

    document.getElementById("popup-action").style.top = (y+18).toString().concat("px");
    document.getElementById("popup-action").style.left = (x+10).toString().concat("px");
    document.getElementById("popup-action").style.visibility = 'visible';
  } else {
    document.getElementById("popup-action").style.visibility = 'hidden';
  }
}

function countUp() {
  var years=0
  countIntrv = setInterval(() => {
      years++;
      strYears = (years < 10) ? "&nbsp;&nbsp;".concat(years.toString()) : years.toString();
      document.getElementById("years").innerHTML = strYears;
      if(years == 25) {
        clearInterval(countIntrv);
      }
  }, 125);
}
