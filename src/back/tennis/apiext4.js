const bodyParser = require("body-parser");


//API Antonio Saborido
var express = require('express');  
var request = require('request');


module.exports.register = (app) => {
    var paths='api/v2/coal-stats/';
    var apiServerHost = 'https://sos2122-22.herokuapp.com/';
    
    var app = express();  
    app.use(paths, function(req, res) {
      var url = apiServerHost + req.baseUrl + req.url;
      console.log('piped: '+req.baseUrl + req.url);
      req.pipe(request(url)).pipe(res);
    });

}