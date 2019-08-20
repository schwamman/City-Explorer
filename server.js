/* eslint-disable no-console */
'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const location = new Location(request.query.location, geoData);
    response.send(location);
  } catch(error) {
    response.status(500).send('Dis website is broke. Call someone who cares.');
  }
});

function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Weather(weatherData, i) {
  this.forecast = weatherData.daily.data[i].summary;
  this.time = convertTime();
  function convertTime() {
    return new Date(weatherData.daily.data[i].time).toString().split(' ').slice(0, 4).join(' ');
  }
}

app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./data/darksky.json');
    const weather = [];
    for (let i = 0; i < weatherData.daily.data.length; i++) {
      let hourlyWeather = new Weather(weatherData, i);
      weather.push(hourlyWeather);
    }
    response.send(weather);
  } catch(error) {
    response.status(500).send('Dis website is broke. Call someone who cares.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('I know that you came to party baby, baby, baby, baby');
});
