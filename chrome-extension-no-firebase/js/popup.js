resetButtonClicked = () => {
    chrome.runtime.sendMessage({command: "reset"});
}

viewFullWebsiteButtonClicked = () => {
    chrome.tabs.create({url: '../html/Knolist.com.html'})
}

startTrackingButtonClicked = () => {
  chrome.runtime.sendMessage({command: "start", project: "default"});
}

stopTrackingButtonClicked = () => {
  chrome.runtime.sendMessage({command: "stop"});
}

createListenerToListSitesVisited = (userId) => {
    console.log(firebase.database())
    var visitedSitesDatabase = firebase.database().ref('sitesVisited/' + userId);
    console.log(visitedSitesDatabase)
    visitedSitesDatabase.on('value', function (snapshot) {
      console.log(snapshot.val())
      websites = snapshot.val();
      websites = Object.values(websites);
      websites.forEach((url) => {
        const div = document.createElement('div');
        div.textContent = `${url}`;
        document.body.appendChild(div)
      });
    });
}

createListeners = () => {
    // Button Listeners
    $( "#reset-button" ).click(resetButtonClicked);
    $( "#full-website-button" ).click(viewFullWebsiteButtonClicked);
    $( "#start-browser-tracking-button" ).click(startTrackingButtonClicked);
    $( "#stop-browser-tracking-button" ).click(stopTrackingButtonClicked);
}

document.addEventListener('DOMContentLoaded', createListeners, false);
