const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const BASE_API_URL = "/api/v1"; 

app.use(bodyParser.json());
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

var stats = require("./premier-league");
stats.register(app);

//API Antonio Saborido

var tennis = require("./tennis");
tennis.register(app);

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
