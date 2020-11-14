// *** set const
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

const weatherLocation = document.getElementById("weather-location");
const weatherIcon = document.getElementById("weather-icon");
const weatherText = document.getElementById("weather-text");
const dayTempertureHigh = document.querySelector(".day-temperture-high");
const dayTempertureLow = document.getElementById("day-temperture-low");
const forecastList = document.getElementById("forecast-list");

const apiId = "e0765432b10963e2879b025bb04f2116";
let city = "Poole,uk";
let lat, lon, dataDays;

// !!! use "units=metric" to show temperature in Celsius
const apiCity =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&units=metric&APPID=" +
  apiId;

// !!! use city to fetch its today's weather
fetch(apiCity)
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    const cityName = data.name;
    const { description, icon } = data.weather[0];
    // console.log(description);
    const iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
    const { temp_max, temp_min } = data.main;
    lat = data.coord.lat;
    lon = data.coord.lon;

    weatherLocation.textContent = cityName;
    weatherIcon.setAttribute("src", iconUrl);
    weatherText.textContent = description;
    dayTempertureHigh.innerHTML = Math.round(temp_max) + "&#8451;";
    dayTempertureLow.innerHTML = Math.round(temp_min) + "&#8451;";

    getWeekApi();
  });

function getWeekApi() {
  // !!! use lat and lon value to fetch another api to get weekly forecast
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
      //   console.log(data);
      const dataDays = data.daily;

      let newDataDays = dataDays.map((day) => {
        return {
          icon: day.weather[0].icon,
          max: Math.round(day.temp.max),
          min: Math.round(day.temp.min),
        };
      });
      // !!! remove the first item, because it's today's figures
      newDataDays.shift();
      //   console.log(newDataDays);

      futureDays();

      forecastList.innerHTML = newDataDays
        .map((day, index) => {
          return `<article class="list-item-title">
        <div class="date">${futureWeek[index]}</div>
        <div class="week-tempture-container">
            <p class="week-tempture-icon"><img src="http://openweathermap.org/img/w/${day.icon}.png" alt="weather icon"></p>
            <p class="week-tempture-max">${day.max}&#8451;</p>
            <p class="week-tempture-min">${day.min}&#8451;</p>
        </div>
    </article>`;
        })
        .join("");
    });
}

function addDay(num) {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return date;
}

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
