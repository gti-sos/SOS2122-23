const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");

const app = express();

const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19586040/UVsPQkGD";

app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const BASE_API_URL = "/api/v1"; 

app.use("/",express.static('public'));

app.get("/cool", (req,res) => {
    console.log("Requested / route");
    res.send(`<html>
                <body>
                    <h1>`+cool()+`</h1>
                </body>
            </html>`);
})


app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

//############## TRABAJO OPCIONAL ALBERTO MARTIN MARTIN (API) ###########################
var stats = [
    {
        country:"Great-Britain",
        year:2018,
        appearences:38,
        cleanSheets:21,
        mostWins:32
    },
    {
        country:"Great-Britain",
        year:2019,
        appearences:38,
        cleanSheets:16,
        mostWins:32
    }
];

app.get(BASE_API_URL+"/premier-league-stats",(req,res)=>{
    res.send(JSON.stringify(stats,null,2));
});

app.post(BASE_API_URL+"/premier-league-stats",(req,res)=>{
    stats.push(req.body);
    res.sendStatus(201,"Created");
});

//#### API TENNIS - ANTONIO SABORIDO CAMPOS ###

var tennis = [
    {
        countries: "serbia",
        years: 2019,
        most_grand_slam: 2,
        masters_finals: 3,
        olympic_gold_medals: 0
    },
    {
        countries: "spain",
        years: 2019,
        most_grand_slam: 2,
        masters_finals: 2,
        olympic_gold_medals: 0
    },
    {
        countries: "great-britain",
        years: 2012,
        most_grand_slam: 1,
        masters_finals: 0,
        olympic_gold_medals: 1
    },
    {
        countries: "russia",
        years: 2021,
        most_grand_slam: 1,
        masters_finals: 1,
        olympic_gold_medals: 0
    },
    {
        countries: "swirtzeland",
        years: 2008,
        most_grand_slam: 1,
        masters_finals: 0,
        olympic_gold_medals: 0
    },
];

app.get(BASE_API_URL+"/tennis", (req, res)=>{
    res.send(JSON.stringify(tennis, null, 2));
});

app.post(BASE_API_URL+"/tennis", (req,res)=>{
    tennis.push(req.body);
    res.sendStatus(201, "CREATED");
});

//TRABAJO OPCIONAL Fernando Pardo Beltrán

var nba = [
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

app.get(BASE_API_URL+"/nba-stats",(req,res)=>{
    res.send(JSON.stringify(stats,null,2));
});

app.post(BASE_API_URL+"/nba-stats",(req,res)=>{
    stats.push(req.body);
    res.sendStatus(201,"Created");
});
