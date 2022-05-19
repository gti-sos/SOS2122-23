const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/


module.exports.register = (app) => {
    const options = {
      method: 'GET',
      url: 'https://ultimate-tennis1.p.rapidapi.com/live_leaderboard/50',
      headers: {
       
      }
    };
    

    
    axios.request(options).then(function (response) {
        tennisplayers=response.data.data;
    }).catch(function (error) {
        console.error(error);
    });   

    app.get(BASE_API + "/tennis-apiext", (req, res) => {
        res.send(JSON.stringify(tennisplayers));
    });
}