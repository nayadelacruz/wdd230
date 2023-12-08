const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const tempDesc = document.querySelector('#tempDesc');
const url = "https://api.openweathermap.org/data/2.5/forecast?lat=47.94&lon=-122.30&appid=d13bf72c84f5976a39fe384f2f87652e&units=imperial";


// latitud and longitud: 47.94492891880514, -122.29993873917891

async function apiFetch() {
    try{
        const response = await fetch(url);
        if( response.ok) {
            const data = await response.json();
            console.log(data); //testing oly
            displayResults(data);//uncomment when ready
            displayForecast(data);
        } else {
            throw Error (await response.text());}
        } catch (error) {
            console.log(error);
        }
    }

function displayResults(data) {
    console.log(data);
    currentTemp.innerHTML = `${data.list[0].main.temp}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
    let desc = data.list[0].weather[0].description;
    weatherIcon.src = iconsrc;
    weatherIcon.setAttribute('height', 100);
    weatherIcon.setAttribute('width',100);
    weatherIcon.alt = `Image of how the weather today: ${desc}`;
    tempDesc.textContent = `${desc}`;
}  

function displayForecast(data){
    //get elements that will contain the forecast
    let nextDay = document.getElementById('nextDay');
    let secondDay = document.getElementById('secondDay');
    let thirdDay = document.getElementById('thirdDay');
    //get dates and weather for three days
    let nextDayDate = data.list[9].dt_txt;
    let nextDayTemp = data.list[9].main.temp;
    let nextDayDesc = data.list[9].weather[0].description;
    let secondDayDate = data.list[17].dt_txt;
    let secondDayTemp = data.list[17].main.temp;
    let secondDayDesc = data.list[17].weather[0].description;
    let thirdDayDate = data.list[25].dt_txt;
    let thirdDayTemp = data.list[25].main.temp;
    let thirdDateDesc = data.list[25].weather[0].description;
    // Dsiplay forecast
    nextDay.innerHTML = `${nextDayDate}
     Temperature of ${nextDayTemp}&deg;F
     ${nextDayDesc}`;

    secondDay.innerHTML = `${secondDayDate} Temperature of ${secondDayTemp}&deg;F ${secondDayDesc}`;

    thirdDay.innerHTML = `${thirdDayDate} Temperature of ${thirdDayTemp}&deg;F ${thirdDateDesc}`;
}
apiFetch();

