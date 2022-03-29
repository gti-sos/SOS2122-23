const BASE_API_URL = "/api/v1/nba-stats";

const bodyParser = require("body-parser");
app.use(bodyParser.json());
    

var nbaStats = [
    {
        country:"usa",
        year:2013,
        mostpoints:2280,
        fieldgoals:731,
        efficiency:30.4
    },
    {
        country:"usa",
        year:2014,
        mostpoints:2593,
        fieldgoals:849,
        efficiency:31.8
    },
    {
        country:"usa",
        year:2015,
        mostpoints:2217,
        fieldgoals:647,
        efficiency:27.2
    }
];

//GET todos los recursos
app.get(BASE_API_URL,(req,res)=>{
    res.send(JSON.stringify(nbaStats,null,2));
});

//POST de un recurso
app.post(BASE_API_URL,(req,res)=>{
    nbaStats.push(req.body);
    res.sendStatus(201,"Created");
});