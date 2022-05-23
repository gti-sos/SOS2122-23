const bodyParser = require("body-parser");

const BASE_API = "/api/v2";


const _ = require('lodash');
const axios = require('axios').default;


module.exports.register = (app) => {

    const init ={
      method: 'GET',
      url: 'https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats/loadInitialData',
    }
    const options = {
      method: 'GET',
      url: 'https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats/',
    };
    

    
    axios.request(options).then(function (response) {
        ext2=response.data;
    }).catch(function (error) {
        console.error(error);
    });   

    app.get(BASE_API + "/apiext2", (req, res) => {
        res.send(JSON.stringify(ext2));
    });
}