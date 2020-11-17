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

// !!! city dropdown list (google places api & Maps JavaScript API)
const searchBox = new google.maps.places.SearchBox(locationInput);

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

let city, dayOrNight;

// ****** EVENT LISTENERS **********
window.addEventListener("DOMContentLoaded", initializeApp);

locationUpdateBtn.addEventListener("click", locationUpdate);

locationInput.addEventListener("keyup", closeLocationUpdate);

// !!!!!!!!!! google searchBox use 'addListener' not addEventListener
searchBox.addListener("places_changed", getWeatherData);

// ****** FUNCTIONS **********
// !!! for city dropdown list
function getWeatherData() {
  // !!! set London as the default city
  let latitude = 51.51;
  let longitude = -0.13;
  let googlePlaceData = [];
  city = "London";

  // !!! when the user already enter something in the input
  // console.log(locationInput.value);
  if (locationInput.value) {
    googlePlaceData = searchBox.getPlaces()[0];
    // console.log(googlePlaceData);
    // !!! change city to user's chosen city
    city = googlePlaceData.name;
    if (googlePlaceData != null) {
      latitude = googlePlaceData.geometry.location.lat();
      longitude = googlePlaceData.geometry.location.lng();
    }
  }

  // !!! get data from weather api
  fetch("/weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      displayWeatherData(data, city);
      addToLocalStorage(city);
      locationInput.value = "";
      locationForm.classList.remove("show-location-submit");
    });
}

// !!! display weather data
function displayWeatherData(data, city) {
  // !!! for status container
  // const cityName = data.name;
  const { description, id } = data.current.weather[0];
  const iconId = "wi-owm-" + dayOrNight + "-" + id;
  // console.log(iconId);
  const { temp, feels_like } = data.current;
  const { max, min } = data.daily[0].temp;
  const dataDays = data.daily;

  weatherLocation.textContent = city;
  weatherIcon.innerHTML = `<i class="wi ${iconId}"></i>`;
  dayTempertureNow.innerHTML = Math.round(temp) + "&#8451;";
  dayTempertureFeelsLike.innerHTML = `feels like ${Math.round(
    feels_like
  )}&#8451;`;
  weatherText.innerHTML = description;
  dayTempertureHigh.innerHTML = Math.round(max) + "&#8451;";
  dayTempertureLow.innerHTML = Math.round(min) + "&#8451;";

  // !!! for forecast list
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
}

// !!! for setting future date
function addDay(num) {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return date;
}

// !!! get an array of the future week
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

// !!! for getting day or night value, it is used in getDayApi() to get the icon name
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

// !!! close locationUpdate input
function closeLocationUpdate(e) {
  if (e.keyCode === 27) {
    // Cancel the default action, if needed
    e.preventDefault();
    locationForm.classList.remove("show-location-submit");
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
  getWeatherData();
  checkLocalstorage();
  locationForm.classList.remove("show-location-submit");
}
