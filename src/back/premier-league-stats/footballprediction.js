const bodyParser = require("body-parser");

const BASE_API = "/api/v1";


const _ = require('lodash');
const axios = require('axios').default;


module.exports.register = (app) => {
    const options = {
        method: 'GET',
        url: 'https://football-prediction-api.p.rapidapi.com/api/v2/predictions',
        params: {market: 'classic', iso_date: '2018-12-01', federation: 'UEFA'},
        headers: {
          //'X-RapidAPI-Host': 'football-prediction-api.p.rapidapi.com',
          //'X-RapidAPI-Key': '64d6c0c825mshbf992849e76fa33p1b0370jsn447112f6b286'
        }
      };

    
    //  axios.request(options).then(function (response) {
    //    predApi=response.data.data;
    //}).catch(function (error) {
    //    console.error(error);
    //});   
//
    //app.get(BASE_API + "/pred", (req, res) => {
    //    res.send(JSON.stringify(predApi));
    //})
}