module.exports.register = (app) => {
    const BASE_API_URL = "/api/v1/nba-stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19911170/UVyrUGFZ";
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
            country:"england",
            year:2014,
            name:"Luol Deng",
            mostpoints:1011,
            fieldgoals:371,
            efficiency:15.3
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
            country: "germany",
            year: 2015,
            name: "Dirk Nowitzki",
            mostpoints: 1333,
            fieldgoals: 487,
            efficiency: 17.1
        },
        {
            country: "australia",
            year: 2016,
            name: "Kyrie Irving",
            mostpoints: 1041,
            fieldgoals: 394,
            efficiency: 16.8
        }
    ];
        //Redirect /docs
        app.get(BASE_API_URL+"/docs",(req,res)=>{
            res.redirect(API_DOC_PORTAL);
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
                        country:"england",
                        year:2014,
                        name:"Luol Deng",
                        mostpoints:1011,
                        fieldgoals:371,
                        efficiency:15.3
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
                        country: "germany",
                        year: 2015,
                        name: "Dirk Nowitzki",
                        mostpoints: 1333,
                        fieldgoals: 487,
                        efficiency: 17.1
                    }
                ];
            }
            res.sendStatus(201, "Created.");
        });

        //GET todos los recursos
        app.get(BASE_API_URL,(req, res)=>{
            var year = req.query.year;
            var from = req.query.from;
            var to = req.query.to;
            if(year != null){
                var filteredList = nbaStats.filter((i)=>
                {
                    return (i.year == year);
                });
                if (filteredList==0){
                    res.sendStatus(404, "Not Found");
                }else{
                    res.send(JSON.stringify(filteredList,null,2));
                }
            }else if(from != null && to != null){
                var filteredList = nbaStats.filter((i)=>
                {
                    return (i.year >= from && i.year <=to);
                });
                if (filteredList==0){
                    res.sendStatus(404, "Not Found");
                }else{
                    res.send(JSON.stringify(filteredList,null,2));
                }
            }else if(year == null && from == null && to == null){
                res.send(JSON.stringify(nbaStats,null,2));
            }else{
                res.sendStatus(400, "Bad Request");
            }
        });
        
        //GET de un recurso (country)
        app.get(BASE_API_URL+"/:country",(req, res)=>{
    
            var country =req.params.country
            var filteredList = nbaStats.filter((i)=>
            {
                return (i.country == country);
            });
        
            var from = req.query.from;
            var to = req.query.to;
        
            if(from != null && to != null){
                filteredList = filteredList.filter((i)=>
                {
                    return (i.year >= from && i.year <=to);
                });
                if (filteredList==0){
                    res.sendStatus(404, "Not Found");
                }else{
                    res.send(JSON.stringify(filteredList,null,2));
                }
            }else{
                if (filteredList==0){
                    res.sendStatus(404, "Not Found");
                }else{
                    res.send(JSON.stringify(filteredList,null,2));
                }
            }
        });

        //GET de dos recursos (country y year)
        app.get(BASE_API_URL+"/:country/:year",(req, res)=>{
    
            var country =req.params.country
            var year = req.params.year
            var filteredList = nbaStats.filter((i)=>
            {
                return (i.country == country && i.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "Not Found");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
        })

        //POST de un recurso
        app.post(BASE_API_URL,(req, res)=>{
        
            if(compBody(req)){
                res.sendStatus(400,"Bad Request");
            }else{
                var filteredList = nbaStats.filter((i)=>
                {
                    return(req.body.country == i.country && req.body.year == i.year)
                })
            
                if(filteredList.length != 0){
                    res.sendStatus(409,"Conflict");
                }else{
                    nbaStats.push(req.body);
                    res.sendStatus(201,"Created");
                }
            }
        
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

        function compBody(req){
            return (req.body.country == null |
                     req.body.year == null | 
                     req.body.name == null |
                     req.body.mostpoints == null | 
                     req.body.fieldgoals == null | 
                     req.body.efficiency == null);
        }
}