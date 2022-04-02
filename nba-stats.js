module.exports.register = (app) => {
    const BASE_API_URL = "/api/v1/nba-stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19911170/UVyrUGFZ";
    const path = require("path");
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    
    var nbaStats = [
        {
            country:"usa",
            year:2013,
            name:"Kevin Durant",
            mostpoints:2280,
            fieldgoals:731,
            efficiency:30.4
        },
        {
            country:"france",
            year:2013,
            name:"Tony Parker",
            mostpoints:1341,
            fieldgoals:519,
            efficiency:21.2
        },
        {
            country:"usa",
            year:2014,
            name:"Kevin Durant",
            mostpoints:2593,
            fieldgoals:849,
            efficiency:31.8
        },
        {
            country:"usa",
            year:2015,
            name:"James Harden",
            mostpoints:2217,
            fieldgoals:647,
            efficiency:27.2
        }
    ];
        //Redirect /docs
        app.get(BASE_API_URL+"/docs",(req,res)=>{
            res.redirect(API_DOC_PORTAL);
        });

        //GET todos los recursos
        app.get(BASE_API_URL,(req,res)=>{
            res.send(JSON.stringify(nbaStats,null,2));
        });

        //GET /loadInitialData
        app.get(BASE_API_URL+"/loadInitialData",(req,res)=>{
            if(nbaStats.length===0){
                nbaStats = [
                    {
                        country:"usa",
                        year:2013,
                        name:"Kevin Durant",
                        mostpoints:2280,
                        fieldgoals:731,
                        efficiency:30.4
                    },
                    {
                        country:"france",
                        year:2013,
                        name:"Tony Parker",
                        mostpoints:1341,
                        fieldgoals:519,
                        efficiency:21.2
                    },
                    {
                        country:"usa",
                        year:2014,
                        name:"Kevin Durant",
                        mostpoints:2593,
                        fieldgoals:849,
                        efficiency:31.8
                    },
                    {
                        country:"usa",
                        year:2015,
                        name:"James Harden",
                        mostpoints:2217,
                        fieldgoals:647,
                        efficiency:27.2
                    },
                    {
                        country: "spain",
                        year: 2015,
                        name: "Marc Gasol",
                        mostpoints: 1413,
                        fieldgoals: 530,
                        efficiency: 21.5
                    }
                ];
            }
            res.sendStatus(201, "Created.");
        });

        //GET de un recurso
        app.get(BASE_API_URL+"/:country",(req,res)=>{
            var country = req.params.country;
            filteredStats = nbaStats.filter((i)=>{
                return (i.country == country);
            });

            if(filteredStats == 0){
                res.sendStatus(404,"Not Foundx");
            }else{
                res.send(JSON.stringify(filteredStats,null,2)); 
            }
        });

        //POST de un recurso
        app.post(BASE_API_URL,(req,res)=>{
            nbaStats.push(req.body);
            res.sendStatus(201,"Created");
        });

        //POST para un recurso específico
        app.post(BASE_API_URL+"/:country",(req,res)=>{
            res.sendStatus(405,"Method Not Allowed");
        });
        
        //PUT todos los recursos
        app.put(BASE_API_URL,(req,res)=>{
            res.sendStatus(405,"Method Not Allowed");
        });

        //DELETE todos los recursos
        app.delete(BASE_API_URL,(req,res)=>{
            nbaStats = [];
            res.sendStatus(200, "Ok");
        });

        //DELETE de un recurso
        app.delete(BASE_API_URL+"/:country",(req,res)=>{
            var country = req.params.country;
            nbaStats = nbaStats.filter((i)=>{
                return (i.country != country);
            });
            res.sendStatus(200, "Ok");
        });

        function comprobar_body(req){
            return (req.body.country == null |
                     req.body.year == null | 
                     req.body.name == null |
                     req.body.mostpoints == null | 
                     req.body.fieldgoals == null | 
                     req.body.efficiency == null);
        }
}

