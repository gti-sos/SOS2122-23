const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

const _ = require('lodash');
const axios = require('axios').default;

var transferFo = [];
module.exports.register = (app) => {
  const options = {
    method: 'GET',
    url: 'https://transfermarket.p.rapidapi.com/statistic/list-golden-boot',
   headers: {
     'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com',
     'X-RapidAPI-Key': '64d6c0c825mshbf992849e76fa33p1b0370jsn447112f6b286'
   }
  };

    
      axios.request(options).then(function (response) {
        transferFo = response.data.player;
      }).catch(function (error) {
        console.error(error);
      });
    
      app.get(BASE_API + "/transfer", (req, res) => {
        res.send(JSON.stringify(transferFo));
      });
}