/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const {
  response
} = require('express');

router.post('', function (req, res, next) {
  // console.log(req);

  var city = req.body.citynameinput;
  var country = req.body.countrycodeinput;
  var longitude = req.body.longitudeinput;
  var latitude = req.body.latitudeinput;
  // console.log(cityName);
  // console.log(country);
  var wheatherData = null;
  // getWeather(cityName).then((response) => {
  //     wheatherData = response.data;

  // });
  getData(res, city, country, latitude, longitude);
});


async function getData(res, city, country, latitude, longitude) {
  const weatherappid = '446be30c4c1cba67963d8da2481d4f95';
  const aqKey = 'e3406ab3d9e847d5900c0c677793b748';
  const option = {
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      'x-rapidapi-key': 'cc83c489demsh754b5b9b4f0d948p15322fjsne17f37b851f0',
      useQueryString: true,
    },
    params: {
      format: 'json',
      code: country,
    },
  };
  // const todayDate = new Date().toISOString().slice(0, 10);

  var weatherResponse = {};
  var covidResponse = {};
  var aqResponse = {};

  await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherappid}&units=metric`)
    .then((response1) => {
      //console.log(1.data)
      //console.log(response1);
      weatherResponse = response1.data;
      return axios.get('https://covid-19-data.p.rapidapi.com/country/code', option);
    }).then((response2) => {
      //console.log(response2);
      covidResponse = response2.data;
      return axios.get(`https://api.breezometer.com/air-quality/v2/current-conditions?lat=${latitude}&lon=${longitude}&key=${aqKey}&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,pollutants_concentrations,pollutants_aqi_information`);
    }).then((response3) => {
      //console.log(response3);

      aqResponse = response3.data;

      console.log(aqResponse);
      //console.log(weatherResponse, covidResponse, aqResponse);

    })
    .catch((error) => {
      console.log(error.response.data);
      aqResponse = error.response.data;
      //return error;
    });
  res.render('../server/views/data-results.ejs', {
    weather: weatherResponse,
    covid: covidResponse[0],
    aqData: aqResponse,
    city: city
  });

}





async function getCovidData(country) {
  console.log(country);
  const option = {
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      'x-rapidapi-key': 'cc83c489demsh754b5b9b4f0d948p15322fjsne17f37b851f0',
      useQueryString: true,
    },
    params: {
      format: 'json',
      code: country,
    },
  };

  var covidResponse = {};
  const todayDate = new Date().toISOString().slice(0, 10);

  await axios.get('https://covid-19-data.p.rapidapi.com/country/code', option)
    .then((response1) => {
      covidResponse = response1.data;
      // console.log(covidResponse);
      const confirmed = covidResponse[0].confirmed;
      const recovered = covidResponse[0].recovered;
      const critical = covidResponse[0].critical;
      const death = covidResponse[0].deaths;
      const lastUpdate = covidResponse[0].lastUpdate.slice(0, 10);
      return covidResponse;
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

// eslint-disable-next-line no-unused-vars
async function getAirQuallityData(latitude, longitude) {

  const apikey = 'e3406ab3d9e847d5900c0c677793b748';

  await axios.get(`https://api.breezometer.com/air-quality/v2/current-conditions?lat=${latitude}&lon=${longitude}&key=${apikey}&features=breezometer_aqi,local_aqi,health_recommendations,sources_and_effects,pollutants_concentrations,pollutants_aqi_information`)
    .then((response) => {
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error.response.data);
      console.log(response.data);
      return error;
    });
}

module.exports = router;