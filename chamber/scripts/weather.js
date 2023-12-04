const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const tempDesc = document.querySelector('#tempDesc');
const url = "https://api.openweathermap.org/data/2.5/weather?lat=47.94&lon=-122.30&appid=d13bf72c84f5976a39fe384f2f87652e&units=imperial";
// latitud and longitud: 47.94492891880514, -122.29993873917891

async function apiFetch() {
    try{
        const response = await fetch(url);
        if( response.ok) {
            const data = await response.json();
            console.log(data); //testing oly
            displayResults(data);//uncomment when ready
        } else {
            throw Error (await response.text());}
        } catch (error) {
            consolelog(error);
        }
    }

function displayResults(data) {
    console.log(data);

    currentTemp.innerHTML = `${data["main"]["temp"]}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    weatherIcon.src = iconsrc;
    weatherIcon.setAttribute('height', 100);
    weatherIcon.setAttribute('width',100);
    weatherIcon.alt = `Image of how the weather today: ${desc}`;
    tempDesc.textContent = `${desc}`;



}    
apiFetch();

