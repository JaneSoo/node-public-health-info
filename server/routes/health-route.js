const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('', function(req, res, next){
  const option = {
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      'x-rapidapi-key': 'cc83c489demsh754b5b9b4f0d948p15322fjsne17f37b851f0',
      useQueryString: true,
    }, params: {
      format: 'json',
      name: 'Czech Republic',
    },
  };

  var covidResponse = {};
  async function requestData() {
    const todayDate = new Date().toISOString().slice(0, 10);

    await axios.get('https://covid-19-data.p.rapidapi.com/country', option)
      .then((response1) => {
        covidResponse = response1.data;
        return axios.get('http://newsapi.org/v2/everything?' +
        'q=Health&' +
        'from=' + todayDate + '&' +
        'sortBy=popularity&' +
        'apiKey=ff2269164e8444ad85f71bb437fde883');
      })
      .then((response2) => {
        console.log(covidResponse);
        const confirmed = covidResponse[0].confirmed;
        const recovered = covidResponse[0].recovered;
        const critical = covidResponse[0].critical;
        const death = covidResponse[0].deaths;
        const lastUpdate = covidResponse[0].lastUpdate.slice(0, 10);
        const articles = response2.data.articles;

        console.log(articles[0]);
        res.render('../server/views/health.ejs',
          {confirmed: confirmed, recovered: recovered,
            critical: critical, death: death, lastUpdate: lastUpdate,
            articles: articles});
      })
      .catch((error) => {
        console.log(error);
        res.render('../server/views/health.ejs');
      });
  }

  requestData();
});

router.get('/score', function(req, res, next){
  res.render('../server/views/health-score.ejs');
});

var responseData = {};
router.post('/score/submit', function(req, res) {
  const mhmAge = Number(req.body.mhmAge);
  const mhmHgt = Number(req.body.mhmHgt);
  const mhmSex = Number(req.body.mhmSex);
  const mhmWgt = Number(req.body.mhmWgt);

  const qlmQ01 = Number(req.body.qlmQ01);
  const qlmQ02 = Number(req.body.qlmQ02);
  const qlmQ03 = Number(req.body.qlmQ03);
  const qlmQ07 = Number(req.body.qlmQ07);

  const data = { mhm: { age: mhmAge, sex: mhmSex, hgt: mhmHgt, wgt: mhmWgt},
    qlm: { q01: qlmQ01, q02: qlmQ02, q03: qlmQ03, q07: qlmQ07 } };

  // VbcDOyHQvRToUPqtY7GQcy9bMgacjwZx1BNCWh5d
  // CaA3TZU89JaRltiuSKoekTNOkOyIxO9ud229gehv
  // hXOd78qNtepDJt2ROPNqPTlvZpMsmbc71sTXYlek
  // KCxPb9XAmkbT4WQYPUNuHeXObuNuaxdJOx7RrYK9

  async function requestScore() {
    try {
      responseData = await axios.post(
        'https://models.dacadoo.com/score/3', data, {
          headers:
          {
            'X-dacadoo-Key': 'VbcDOyHQvRToUPqtY7GQcy9bMgacjwZx1BNCWh5d',
          },
        },
      );
      const components = responseData.data.components;
      const subscores = responseData.data.subscores;
      const scr = responseData.data.scr;
      res.render('../server/views/health-score-result.ejs',
        {components: components, subscores: subscores, scr: scr});

    } catch (error) {
      console.error(error);
      res.render('../server/views/health-score-limit.ejs');
    }
  }

  requestScore();
});


module.exports = router;
