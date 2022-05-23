const bodyParser = require("body-parser");

const BASE_API = "/api/v1";


const _ = require('lodash');
const axios = require('axios').default;


module.exports.register = (app) => {

    const init ={
      method: 'GET',
      url: 'https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/loadInitialData',
    }
    const options = {
      method: 'GET',
      url: 'https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/',
    };
    

    
    axios.request(options).then(function (response) {
        ext1=response.data;
    }).catch(function (error) {
        console.error(error);
    });   

    app.get(BASE_API + "/apiext1", (req, res) => {
        res.send(JSON.stringify(ext1));
    });
}