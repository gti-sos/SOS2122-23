const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/
const config = require('./config.json');


module.exports.register = (app) => {
    console.log("hola");
    app.use(bodyParser.json());
    (async () => {
        /* Get access token */
        /* Get access token */
        const access_token = 'Bearer ' + (await axios({
            method: 'post',
            url: 'https://id.twitch.tv/oauth2/token',
            params: {
                client_id: config.client_id,
                client_secret: config.client_secret,
                grant_type: 'client_credentials'
            }
        })).data.access_token;



        /* Set a date limit (Friday 23h42) */
        const prevFriday = new Date();

        prevFriday.setDate(prevFriday.getDate() - (prevFriday.getDay() + 2) % 4);
        prevFriday.setHours(23, 42);

        /* Retrieve channel's latest clips */


        /* Computes and sorts the best clippers */
        // ################################################# ME ######################################## //


        /*
        const th3antonioclips = _.groupBy((await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '39115143',
                started_at: prevFriday,
                first: '5',
            }
        })).data.data, 'broadcaster_id');
        */
        const league = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips?language=es',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                game_id: '2963',
                //started_at: prevFriday,
                first: '20',
            }
        })).data.data;

        app.get(BASE_API + "/tennis-twitch", (req, res) => {
            res.send(JSON.stringify(league));
        });

        app.get(BASE_API + "/tennis-twitch" + "/:language", (req,res) => {
            var language = req.params.language;
            filteredLanguage = league.filter((cont) => {
                return(cont.language == language);
            });

            if(filteredLanguage == 0){
                res.sendStatus(404, "NOT FOUND");
            }else{
                res.send(JSON.stringify(filteredLanguage));
            }
        })
       
        //console.log(th3antonioclips);
        // console.log(JSON.stringify(th3antonioclips.null.broadcaster_id, null,2));
        /*
        app.get(BASE_API + "/th3antonio" + "/:data", (req, res) => {
            var data = req.param.country;
            filteredData = th3antonioclips.filter((cont) => {
                return (cont.data == data);
            });
            if (filteredData == 0) {
                res.sendStarus(404, "NOT FOUND");
            } else {
                res.send(JSON.stringify(filteredData, null, 2));
            }
            console.log("pene");
        })
        const th3antonioclips2 = (await axios({
            method: 'get',
            url: 'http://localhost:8080/api/v1/th3antonio',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
        })).data._.client_id;
        app.get(BASE_API + "/th3antonio2", (req, res) => {
            res.send(JSON.stringify(th3antonioclips2));
        });
        */
    })();





}