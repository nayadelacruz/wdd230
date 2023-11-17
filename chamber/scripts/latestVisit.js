// milliseconds to days constant = 1000 ms/s * 60 s/m * 60 m/h * 24 h/day
const msToDays = 86400000;
let dateToday = new Date();
let lastVisit = (window.localStorage.getItem("lastVisit-ls"));
//Pass dates into milliseconds to compare them
let date1 = dateToday.getTime();
//I had to put last visit into new Date because when I put it
//in the local storage it lost it's date atribute so
//by putting the date in the local storage into the new Date
//I made the value a numeric date value
let date2 = new Date(lastVisit).getTime();
let visitDifference = date1 - date2;

//mesages
let messageElement = document.querySelector("#lastVisit");
let message = "";

//comparing dates to display messages
if (lastVisit == "") {
    message = "Welcome! Let us know if you have any questions.";
    messageElement.textContent = message;
    lastVisit = Number(window.localStorage.setItem('lastVisit-ls', dateToday));
} else if (lastVisit != "") {
    if(visitDifference < msToDays) {
        message = "Back so soon! Awesome!";
        messageElement.textContent = message;
        lastVisit = Number(window.localStorage.setItem('lastVisit-ls', dateToday))
    } else{
        let days = visitDifference / msToDays;
        let daysFixed = days.toFixed(0);
        if(daysFixed == 1) {
            message = `You last visited ${daysFixed} day ago`;
            messageElement.textContent = message;
            lastVisit = Number(window.localStorage.setItem('lastVisit-ls', dateToday))
        } else {
            message = `You last visited ${daysFixed} days ago`;
            messageElement.textContent = message;
        lastVisit = Number(window.localStorage.setItem('lastVisit-ls', dateToday))
    }}
};
