const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const apikey = process.env.OPEN_WEATHER_API_KEY || "";
// console.log('apikey', apikey);

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("OK | 200");
});

const getReverseGeocodingLocationData = async (req, res) => {
  const { lat, lon, deviceId, limit } = req.query;
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/reverse",
      {
        params: {
          lat,
          lon,
          limit: 1,
          appId: apikey,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (e) {
    res.status(400).send("Failed to get location data");
    console.log(e);
  }
};

const getLocationDetails = async (req, res) => {
  const { city, limit, deviceId } = req.query;
  // console.log(city, limit);
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: city,
          limit,
          appId: apikey,
        },
      }
    );
    // console.log(response.data);
    res.status(200).send(response.data);
  } catch (e) {
    res.status(500);
    console.log(e);
  }
  //   res.send('');
};

const getWeatherData = async (req, res) => {
  const { lat, lon, deviceId } = req.query;
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/3.0/onecall",
      {
        params: {
          lat,
          lon,
          appId: apikey,
          exclude: "minutely,hourly,alerts",
          units: "metric",
        },
      }
    );
    // console.log(response.data);
    res.status(200).send(response.data);
  } catch (e) {
    res.status(500);
    console.log(e);
  }
  //   res.send('');
};

const getAirPollutionData = async (req, res) => {
  const { lat, lon, deviceId } = req.query;
  try {
    const response = await axios.get(
      "http://api.openweathermap.org/data/2.5/air_pollution",
      {
        params: {
          lat,
          lon,
          appId: apikey,
        },
      }
    );
    // console.log(response.data);
    res.status(200).send(response.data);
  } catch (e) {
    res.status(500);
    console.log(e);
  }
  //   res.send('');
};

const postFeedback = (req, res) => {
  const { feedback } = req.body;
  const { deviceId } = req.query;
  // console.log("Feedback", feedback);
  // console.log("Device ID", deviceId);
  res.status(200);
};

app.get("/get-rev-geo-loc-details", getReverseGeocodingLocationData);

app.get("/get-location-details", getLocationDetails);

app.get("/get-weather-data", getWeatherData);

app.get("/get-air-pollution-data", getAirPollutionData);

app.post("/feedback", postFeedback);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
