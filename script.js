const API_KEY = "adcab5101688a49582f8259a8a20d791"; 


/* =====================
   INDEX PAGE SEARCH
===================== */
const searchBtn = document.getElementById("searchBtn");

if(searchBtn){

    searchBtn.addEventListener("click", () => {

        const city =
        document.getElementById("cityInput").value.trim();

        console.log("City =", city);

        if(city){

            localStorage.setItem("lastCity", city);

            console.log(
                "Saved:",
                localStorage.getItem("lastCity")
            );

            window.location.href =
            `weather.html?city=${city}`;
        }

    });

}

/* =====================
   WEATHER PAGE
===================== */

const cityName =
document.getElementById("cityName");

if(cityName){

loadWeather();

}

async function loadWeather(){

const params =
new URLSearchParams(window.location.search);

const city =
params.get("city") || 
localStorage.getItem("lastCity") ||
"Bhubaneswar";

localStorage.setItem("lastCity",city);
console.log("City from URL:",city);
try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
);

const data =
await response.json();
/*const currentTime = Date.now()/1000;

if(
   currentTime > data.sys.sunrise &&
   currentTime < data.sys.sunset
){
  document.body.classList.add("day-theme");
}
else{
   document.body.classList.add("night-theme");
   createStars();
}*/
const currentTime = Date.now()/1000;

console.log("Current:", currentTime);
console.log("Sunrise:", data.sys.sunrise);
console.log("Sunset:", data.sys.sunset);

document.body.classList.remove("day-theme","night-theme");

if(
   currentTime > data.sys.sunrise &&
   currentTime < data.sys.sunset
){
   console.log("DAY MODE");
   document.body.classList.add("day-theme");
}
else{
   console.log("NIGHT MODE");
   document.body.classList.add("night-theme");
   createStars();
}
console.log(data);

/* ETHI */
const lat = data.coord.lat;
const lon = data.coord.lon;

console.log("CITY:",city);
console.log("LAT:",lat);
console.log("LON:",lon);

const aqiResponse = await fetch(
`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
);

const aqiData = await aqiResponse.json();
console.log("AQI DATA:", aqiData);
console.log(JSON.stringify(aqiData, null,2));

const aqi = aqiData.list[0].main.aqi;
console.log("AQI VALUE:", aqi);

if (
    document.getElementById("aqiStatus") &&
    document.getElementById("aqiMessage") &&
    document.getElementById("aqiAdvice")
){
    updateAQI(aqi);
}
/*updateAQI(aqi);*/

/* ETHI SESA */

updateCurrentWeather(data);

loadForecast(city);

}catch(error){

console.log(error);

}

}

/* =====================
   CURRENT WEATHER
===================== */

function updateCurrentWeather(data){

document.getElementById("weatherMessage").innerHTML 
 =`${data.weather[0].description} is currently occuring in
<span class="city-highlight">${data.name}</span>`;

document.getElementById("cityName")
.textContent = data.name;

/*document.getElementById("countryName")
.textContent = `${data.name}, ${data.sys.country}`;*/
const countryNames = {
    GB: "United Kingdom",
    IN: "India",
    US: "United States",
    CA: "Canada",
    AU: "Australia"
};

const countryFullName =
countryNames[data.sys.country] || data.sys.country;

document.getElementById("countryName").textContent =
`${data.name}, ${countryFullName}`;

document.getElementById("temperature")
.textContent =
Math.round(data.main.temp)+"°";

document.getElementById("feelsLike").textContent =
Math.round(data.main.feels_like) + "°";

document.getElementById("weatherDescription")
.textContent =
data.weather[0].description;
console.log(data.weather);

document.getElementById("humidity")
.textContent =
data.main.humidity+"%";
console.log(document.getElementById("humidity"));


document.getElementById("wind")
.textContent =
/*data.wind.speed+" km/h";*/
Math.round(data.wind.speed * 3.6) + "km/h";

document.getElementById("pressure")
.textContent =
data.main.pressure+" hPa";

document.getElementById("visibility")
.textContent =
(data.visibility/1000).toFixed(1)+" km";


document.getElementById("weatherCondition")
.textContent = data.weather[0].main;


console.log(data.weather[0].icon);
document.getElementById("conditionIcon").src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
applyTheme(data.weather[0].main);
console.log(document.getElementById("weatherIcon"));
console.log(document.getElementById("weatherIcon").src);

document.getElementById("weatherIcon")
.src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
applyTheme(data.weather[0].main);

updateLiveWeather(data);


function updateDateTime() {

    const now = new Date();

    const currentTime = 
    document.getElementById("currentTime") ||
    document.getElementById("localTime");
    const currentDate = document.getElementById("currentDate");
    const updatedTime = document.getElementById("lastUpdated");

    if(currentTime){
        currentTime.innerHTML = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    if(currentDate){
        currentDate.innerHTML = now.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    if(updatedTime){
        updatedTime.innerHTML = now.toLocaleString();
    }
    
}
updateDateTime();
setInterval(updateDateTime, 1000);

/* Live Weather Report */

function updateLiveWeather(data){
let weatherText = "";
console.log(data.weather[0].main);
switch(data.weather[0].main){

    case "Rain":
        weatherText = `🌧️ ${data.weather[0].description} currently affecting <span class="city-highlight">${data.name}</span>`;
        break;
        

    case "Clouds":
        weatherText = `☁️ ${data.weather[0].description} currently observed over <span class="city-highlight">${data.name}</span>`; 
        break;

    case "Clear":
        weatherText = `☀️ Enjoy the Clear sky and have a wonderful day in  <span class="city-highlight">${data.name}</span>`;
        break;

    case "Thunderstorm":
        weatherText = `⛈️ ${data.weather[0].description} reported in <span class="city-highlight">${data.name}</span>`;
        break;

    case "Drizzle":
        weatherText = `🌦️ Light drizzle reported in <span class="city-highlight">${data.name}</span>`;
        break;

    case "Mist":
        weatherText = `🌫️ Misty conditions observed in <span class="city-highlight">${data.name}</span>`;
        break;


    case "Snow":
        weatherText = `❄️ Snowfall reported in<span class="city-highlight">${data.name}</span>`;
        break;

    default:
        weatherText = `🌍 Current weather in <span class="city-highlight">${data.name}</span>: ${data.weather[0].description}`;
         break;
}
console.log(weatherText);
document.getElementById("weatherMessage").innerHTML = weatherText;

}
function getWeatherMessage(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("rain")) {
    return "🌧️ Stay safe and don't forget your umbrella ☔";
  }

  if (condition.includes("thunder")) {
    return "⛈️ Thunderstorms expected, stay indoors if possible ⚡";
  }

  if (condition.includes("clear") || condition.includes("sunny")) {
    return "🌞 Enjoy the clear skies and have a wonderful day ✨";
  }

  if (condition.includes("cloud")) {
    return "☁️ Pleasant weather with beautiful clouds today 🌤️";
  }

  if (condition.includes("mist") || condition.includes("fog")) {
    return "🌫️ Drive carefully, visibility may be reduced 🚗";
  }

  return "🌤️ Have a great day and enjoy the weather!";
}
}

/* =====================
   DYNAMIC WEATHER THEME
===================== */

function applyTheme(weather){

const body =
document.body;

weather =
weather.toLowerCase();

if(weather.includes("rain")){

body.classList.add("rainy-theme");

createRain();

}

else if(weather.includes("cloud")){

body.classList.add("cloudy-theme");

}

else if(weather.includes("clear")){

body.classList.add("sunny-theme");

}
else if(weather.includes("thunder")){

body.classList.add("thunder-theme");


}
else if(weather.includes("snow")){

body.classList.add("snow-theme");
}
}
/* =====================
   RAIN EFFECT
===================== */

function createRain(){

const rain =
document.createElement("div");

rain.className="rain";

for(let i=0;i<100;i++){

const drop =
document.createElement("div");

drop.className="drop";

drop.style.left =
Math.random()*100+"%";

drop.style.animationDuration =
0.5+Math.random()+"s";

rain.appendChild(drop);

}

document.body.appendChild(rain);

}

/*------------------weather page air quality--------*/

function updateAQI(aqi){

const aqiCard = document.querySelector(".air-quality-card");
const aqiCircle = document.querySelector(".aqi-circle");
    
const status = document.getElementById("aqiStatus");
const message = document.getElementById("aqiMessage");
const advice = document.getElementById("aqiAdvice");
if(!status || !message || !advice){
    return;
}
if(aqi === 1){
        status.textContent = "Good 😊";
        message.textContent = "Air quality is good.";
        advice.textContent = "Perfect for outdoor activities.";
    }

    else if(aqi === 2){
        status.textContent = "Fair 🙂";
        message.textContent = "Air quality is acceptable.";
        advice.textContent = "Most people can continue normal activities.";

        aqiCircle.style.borderColor = "#84cc16"; // Light Green
    }

    else if(aqi === 3){
        status.textContent = "Moderate 😐";
        message.textContent = "Air quality is moderate.";
        advice.textContent = "Sensitive people should be careful.";

         aqiCircle.style.borderColor = "#f59e0b"; // Orange
    }

    else if(aqi === 4){
        status.textContent = "Poor 😷";
        message.textContent = "Air quality is unhealthy.";
        advice.textContent = "Reduce outdoor activities.";

         aqiCircle.style.borderColor = "#ef4444"; // Red
    }

    else if(aqi === 5){
        status.textContent = "Very Poor ☠️";
        message.textContent = "Air quality is very unhealthy.";
        advice.textContent = "Stay indoors when possible.";

         aqiCircle.style.borderColor = "#a855f7"; // Purple
    }

    document.getElementById("aqiValue").textContent = aqi;
}

/* =====================
   FORECAST
===================== */

async function loadForecast(city){

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
);

const data =
await response.json();

const forecastContainer =
document.getElementById("forecastContainer");

if(!forecastContainer) return;

forecastContainer.innerHTML="";

const dailyForecast =
data.list.filter(item =>
item.dt_txt.includes("12:00:00")
);

dailyForecast.slice(0,5)
.forEach(day=>{

const card =
document.createElement("div");

card.className=
"forecast-card";

const date =
new Date(day.dt_txt);

card.innerHTML=
`
<h4>
${date.toLocaleDateString(
'en-US',
{weekday:'short'}
)}
</h4>

<img src=
"https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather">

<h3>
${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°
</h3>

<p>
${day.weather[0].main}
</p>
`;

forecastContainer.appendChild(card);

});

}
function goToWeather(){
   const city = document.getElementById("cityInput").value.trim();
   if (!city){
      alert("Please enter a city name");
      return;
   }
   window.location.href = `weather.html?city=${city}`;
}

/*----- Dynamic Day/ Night Theme-----------*/
function setDayNightTheme(){

const hour = new Date().getHours();

/*if(hour >= 6 && hour < 18){*/

document.body.classList.remove("day-theme","night-theme");
    if(hour >= 6 && hour < 18){

        document.body.classList.add("day-theme");

}else{

document.body.classList.add("night-theme");

createStars();

    }

}

//setDayNightTheme();

/* Stars Animation (Night) -----*/
function createStars(){

for(let i=0;i<100;i++){

const star =
document.createElement("div");

star.classList.add("star");

star.style.left =
Math.random()*100+"%";

star.style.top =
Math.random()*100+"%";

document.body.appendChild(star);

}
function createLightning(){

    const lightning =
    document.createElement("div");

    lightning.classList.add("lightning");

    document.body.appendChild(lightning);

    setTimeout(()=>{
        lightning.remove();
    },500);
}
function createSnow(){

    for(let i=0;i<50;i++){

        const snow =
        document.createElement("div");

        snow.classList.add("snowflake");

        snow.innerHTML = "❄";

        snow.style.left =
        Math.random()*100+"%";

        snow.style.animationDelay =
        Math.random()*5+"s";

        document.body.appendChild(snow);
    }
}

}