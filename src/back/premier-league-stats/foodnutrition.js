const bodyParser = require("body-parser");

const BASE_API = "/api/v1";


const _ = require('lodash');
const axios = require('axios').default;


module.exports.register = (app) => {
    const options = {
        method: 'GET',
        url: 'https://food-nutrition-information.p.rapidapi.com/food/1497465',
        headers: {
          //'X-RapidAPI-Host': 'food-nutrition-information.p.rapidapi.com',
          //'X-RapidAPI-Key': '64d6c0c825mshbf992849e76fa33p1b0370jsn447112f6b286'
        }
      };

    
    //axios.request(options).then(function (response) {
    //  foodNut = response.data.labelNutrients;
    //}).catch(function (error) {
    //  //console.error(error);
    //});
  //
    //app.get(BASE_API + "/food", (req, res) => {
    //  res.send(JSON.stringify(foodNut));
    //});
}