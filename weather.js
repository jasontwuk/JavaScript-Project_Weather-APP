// ****** SELECT ITEMS **********
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let futureWeek = [];

const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location-input");
const locationUpdateBtn = document.getElementById("location-update-btn");
const locationSubmitBtn = document.getElementById("location-submit-btn");

const messageContainer = document.getElementById("message-container");
const messageBtn = document.getElementById("message-btn");

const weatherLocation = document.getElementById("weather-location");
const weatherIcon = document.getElementById("weather-icon");
const dayTempertureNow = document.getElementById("day-temperture-now");
const dayTempertureFeelsLike = document.getElementById(
  "day-temperture-feels-like"
);
const weatherText = document.getElementById("weather-text");
const dayTempertureHigh = document.querySelector(".day-temperture-high");
const dayTempertureLow = document.getElementById("day-temperture-low");
const forecastList = document.getElementById("forecast-list");

const apiId = "e0765432b10963e2879b025bb04f2116";
let city = "London";
let lat, lon, dataDays, dayOrNight;

// ****** EVENT LISTENERS **********
window.addEventListener("DOMContentLoaded", initializeApp);

locationUpdateBtn.addEventListener("click", locationUpdate);

locationSubmitBtn.addEventListener("click", locationSubmit);

messageBtn.addEventListener("click", closeMessage);

locationInput.addEventListener("keyup", submitByClickEnterBtn);

// ****** FUNCTIONS **********
function getDayApi() {
  // !!! use "units=metric" to show temperature in Celsius
  const apiCity =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&APPID=" +
    apiId;

  // !!! use city name to fetch its today's weather
  fetch(apiCity)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      const cityName = data.name;
      const { description, id } = data.weather[0];
      const iconId = "wi-owm-" + dayOrNight + "-" + id;
      // console.log(iconId);
      const { temp, feels_like, temp_max, temp_min } = data.main;
      lat = data.coord.lat;
      lon = data.coord.lon;

      weatherLocation.textContent = cityName;
      weatherIcon.innerHTML = `<i class="wi ${iconId}"></i>`;
      dayTempertureNow.innerHTML = Math.round(temp) + "&#8451;";
      dayTempertureFeelsLike.innerHTML = `feels like ${Math.round(
        feels_like
      )}&#8451;`;
      weatherText.innerHTML = description;
      dayTempertureHigh.innerHTML = Math.round(temp_max) + "&#8451;";
      dayTempertureLow.innerHTML = Math.round(temp_min) + "&#8451;";

      getWeekApi();

      // !!! only edit localStorage when the user enters a valid city name
      // console.log(data.cod);
      if (data.cod !== "404") {
        addToLocalStorage(city);
      }
    })
    .catch(() => {
      // !!! when a user enters an invalid city name, show the message
      messageContainer.classList.add("show-message");
      messageBtn.focus();
    });
}

function getWeekApi() {
  // !!! use lat and lon value to fetch another api to get future week's forecast
  const apiWeekly =
    "http://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric&exclude=weekly&APPID=" +
    apiId;

  fetch(apiWeekly)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const dataDays = data.daily;

      let newDataDays = dataDays.map((day) => {
        return {
          iconId: day.weather[0].id,
          max: Math.round(day.temp.max),
          min: Math.round(day.temp.min),
        };
      });
      // !!! remove the first item, because it's today's figures
      newDataDays.shift();
      // console.log(newDataDays);

      futureDays();

      forecastList.innerHTML = newDataDays
        .map((day, index) => {
          return `<article class="list-item-title">
        <div class="date">${futureWeek[index]}</div>
        <div class="week-tempture-container">
            <p class="week-tempture-icon"><i class="wi wi-owm-${day.iconId}"></i></p>
            <p class="week-tempture-max">${day.max}&#8451;</p>
            <p class="week-tempture-min">${day.min}&#8451;</p>
        </div>
    </article>`;
        })
        .join("");
    });
}

// !!! for setting future date
function addDay(num) {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return date;
}

// !!! get an array of future week
function futureDays() {
  for (let i = 1; i < 8; i++) {
    let newDate = addDay(i);
    let dd = String(newDate.getDate()).padStart(2, "0");
    let mm = months[newDate.getMonth()]; //January is 0!
    let day = weekdays[newDate.getDay()];
    let today = dd + " " + mm + " (" + day + ")";
    // console.log(today);
    futureWeek.push(today);
  }
  // console.log(futureWeek);
  return futureWeek;
}

// !!! for getting day or night value, it uses in getDayApi() to get icon name
function getDayNight() {
  const now = new Date();
  let hour = now.getHours();

  if (hour < 7 || hour > 17) {
    dayOrNight = "night";
  } else {
    dayOrNight = "day";
  }
  return dayOrNight;
}

// !!! when a user clicks the locationUpdateBtn
function locationUpdate(e) {
  e.preventDefault();
  locationForm.classList.add("show-location-submit");
  locationInput.focus();
}

// !!! when a user clicks the locationSubmitBtn
function locationSubmit(e) {
  e.preventDefault();
  city = locationInput.value;
  getDayApi();
  locationInput.value = "";
  locationForm.classList.remove("show-location-submit");
}

// !!! when a user clicks the messageBtn
function closeMessage() {
  messageContainer.classList.remove("show-message");
}

// !!! let users triger locationSubmitBtn by enter key
function submitByClickEnterBtn(e) {
  // Number 13 is the "Enter" key on the keyboard
  if (e.keyCode === 13) {
    // Cancel the default action, if needed
    e.preventDefault();
    // Trigger locationSubmitBtn with a click
    locationSubmitBtn.click();
  }
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(value) {
  localStorage.setItem("city", JSON.stringify(value));
}
function checkLocalstorage() {
  if (localStorage.getItem("city")) {
    city = JSON.parse(localStorage.getItem("city"));
  }
}

// ****** initializeApp APP **********
function initializeApp() {
  getDayNight();
  checkLocalstorage();
  getDayApi();
  locationForm.classList.remove("show-location-submit");
}
