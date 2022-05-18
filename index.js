const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8081;
const BASE_API_URL = "/api/v1"; 

const Datastore = require('nedb');


//BASE DE DATOS
db_premier_league = new Datastore();
db_tennis = new Datastore();
db_tennis2 = new Datastore();
db_nba_stats = new Datastore();
db_nba_stats2 = new Datastore();



app.use(bodyParser.json());
app.use("/",express.static('public'));

const twitch = require("./src/back/tennis/tennistwitch");
twitch.register(app);

const tennislivedata = require("./src/back/tennis/tennislivedata");
tennislivedata.register(app);

app.get("/cool", (req,res) => {
    console.log("Requested / route");
    res.send(`<html>
                <body>
                    <h1>`+cool()+`</h1>
                </body>
            </html>`);
});


app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

//############## TRABAJO OPCIONAL ALBERTO MARTIN MARTIN (API) ###########################



const backend_premier_leaguev1 = require("./src/back/premier-league-stats/v1/premier-league.js");
backend_premier_leaguev1.register(app,db_premier_league);


const backend_premier_leaguev2 = require("./src/back/premier-league-stats/v2/premier-league.js");
backend_premier_leaguev2.register(app);

//API Antonio Saborido
const tennis_API = require("./src/back/tennis/tennis.js");

tennis_API.register(app,db_tennis);

const tennis_APIv2 = require("./src/back/tennis/tennisv2.js");

tennis_APIv2.register(app,db_tennis2);

//API Fernando Pardo Beltrán(nba-stats)

const nbaStats_API = require("./src/back/nba-stats/nba-stats_v1");
nbaStats_API.register(app,db_nba_stats);

const nbaStats_API_v2 = require("./src/back/nba-stats/nba-stats_v2");
nbaStats_API_v2.register(app,db_nba_stats2);
