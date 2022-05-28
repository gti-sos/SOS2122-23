const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

const _ = require('lodash');
const axios = require('axios').default;

var serieIta = [];
module.exports.register = (app) => {
    const options = {
        method: 'GET',
        url: 'https://serie-a2.p.rapidapi.com/leaderboard',
        headers: {
          'X-RapidAPI-Host': 'serie-a2.p.rapidapi.com',
          'X-RapidAPI-Key': '64d6c0c825mshbf992849e76fa33p1b0370jsn447112f6b286'
        }
      };
    
    axios.request(options).then(function (response) {
        serieIta = response.data.data;
    }).catch(function (error) {
      console.error(error);
    });
    
    app.get(BASE_API + "/seriea", (req, res) => {
      res.send(JSON.stringify(serieIta));
    });
}