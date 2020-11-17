if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

const axios = require("axios");

// set up server
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/weather", (req, res) => {
  const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${req.body.latitude}&lon=${req.body.longitude}&units=metric&exclude=weekly&APPID=${OPEN_WEATHER_API_KEY}`;
  // console.log(req.body);
  axios({
    url: url,
    responseType: "json",
  }).then((data) => res.json(data.data));
});

app.listen(3000, () => {
  console.log("server started");
});
