const BASE_API_URL = "/api/v1/nba-stats";
const res = require("express/lib/response");
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19911170/UVyrUGFZ";
const bodyParser = require("body-parser");
    
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
    
module.exports.register = (app,db) => {
    //Redirect /docs
    app.get("/api/v2/nba-stats"+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //GET /loadInitialData
    app.get(BASE_API_URL+"/loadInitialData",(req,res)=>{
        db.find({}, function(err,filteredList){

            if(err){
                res.sendStatus(500, "CLIENT ERROR");
            
            }
            if(filteredList==0){
                for(var i = 0; i<nbaStats.length;i++){
                    db.insert(nbaStats[i]);
                }
                res.sendStatus(200,"OK");
                
            }
        });
    });

    //GETs

//GET Global y años

app.get(BASE_API_URL,(req,res)=>{
    var year = req.query.year;
    var from = req.query.from;
    var to   = req.query.to;

    //Comprobaciones
    //Comprobacion query 

    for(var i = 0; i<Object.keys(req.query).length;i++){
        var element = Object.keys(req.query)[i];
        if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset"){
            res.sendStatus(400, "Bad Request");
            
        }
    }
    
    //Comprobacion from menor que to

    if(from>to){
        res.sendStatus(400, "Bad Request");
        
    }

    db.find({},function(err, filteredList){

        if(err){
            res.sendStatus(500, "Client Error");   
        }

        // Apartado para búsqueda por año
        
        if(year != null){
            var filteredList = filteredList.filter((reg)=>
            {
                return (reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "Not Found");     
            }
        }

        // Apartado para from y to
        
        if(from != null && to != null){
            filteredList = filteredList.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });

            if (filteredList==0){
                res.sendStatus(404, "Not Found");
            }    

            
        }
        // RESULTADO

        if(req.query.limit != undefined || req.query.offset != undefined){
            filteredList = pagination(req,filteredList);
        }
        filteredList.forEach((element)=>{
            delete element._id;
        });
        res.send(JSON.stringify(filteredList,null,2));
    });
    
  

});

//GET Pais y opcion entre años

app.get(BASE_API_URL+"/:country",(req, res)=>{

    var country =req.params.country
    var from = req.query.from;
    var to = req.query.to;

    //Comprobaciones
    //Comprobaciones query
    
    for(var i = 0; i<Object.keys(req.query).length;i++){
        var element = Object.keys(req.query)[i];
        if(element != "from" && element != "to"){
            res.sendStatus(400, "Bad Request");
            return;
        }
    }

     //Comprobacion from menor que to

     if(from>to){
        res.sendStatus(400, "Bad Request");
        
    }

    db.find({}, function(err,filteredList){
            
        if(err){
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }

        filteredList = filteredList.filter((reg)=>
        {
            return (reg.country == country);
        });


        if(from != null && to != null && from<=to){
            filteredList = filteredList.filter((reg)=>
            {
               return (reg.year >= from && reg.year <=to);
            }); 
            
        }
        //COMPROBAMOS SI EXISTE
        if (filteredList==0){
            res.sendStatus(404, "NOT FOUND");
            return;
        }
        //RESULTADO
        if(req.query.limit != undefined || req.query.offset != undefined){
            filteredList = pagination(req,filteredList);
        }
        filteredList.forEach((element)=>{
            delete element._id;
        });
        res.send(JSON.stringify(filteredList,null,2));
    });

});


//GET por Pais y Año

app.get(BASE_API_URL+"/:country/:year",(req, res)=>{

    var country =req.params.country
    var year = req.params.year

    db.find({},function(err, filteredList){

        if(err){
            res.sendStatus(500, "ERROR EN CLIENTE");
            
        }

        filteredList = filteredList.filter((reg)=>
        {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList==0){
            res.sendStatus(404, "NO EXISTE");
            
        }

        //RESULTADO

        //Paginación
        if(req.query.limit != undefined || req.query.offset != undefined){
            filteredList = pagination(req,filteredList);
            res.send(JSON.stringify(filteredList,null,2));
        }
        filteredList.forEach((element)=>{
            delete element._id;
        });
        res.send(JSON.stringify(filteredList[0],null,2));
    });

});

    /*
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
    */

    //POSTs

    //POST resources list

    app.post(BASE_API_URL,(req, res)=>{
        
        //Comprobamos formato JSON
        if(compBody(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            db.find({},function(err,filteredList){

                if(err){
                    res.sendStatus(500, "CLIENT ERROR");
                
                }

                filteredList = filteredList.filter((reg)=>
                {
                    return(req.body.country == reg.country && req.body.year == reg.year)
                })
            
                if(filteredList.length != 0){
                    res.sendStatus(409,"CONFLICT");
                }else{
                    db.insert(req.body);
                    res.sendStatus(201,"CREATED");
                }
            });
        }

    });

    /*//POST de un recurso
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
    */

    //POST para un recurso específico
    app.post(BASE_API_URL+"/:country",(req,res)=>{
        res.sendStatus(405,"Method Not Allowed");
    });

    //PUT para un recurso específico
    app.put(BASE_API_URL + "/:country/:year", (req, res) => {

        if (compBody(req)) {
            res.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
            return;
        }
        var countryR = req.params.country;
        var yearR = req.params.year;
        var body = req.body;

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }

            filteredList = filteredList.filter((reg) => {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXIST");
                return;
            }

            if (countryR != body.country || yearR != body.year) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            db.update({ $and: [{ country: String(countryR) }, { year: parseInt(yearR) }] }, { $set: body }, {}, function (err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                } else {
                    res.sendStatus(200, "UPDATED");
                }
            });
        })
    })
    
    //PUT todos los recursos
    app.put(BASE_API_URL,(req,res)=>{
        res.sendStatus(405,"Method Not Allowed");
    });

    // DELETE de una lista de recursos

    app.delete(BASE_API_URL,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"CLIENT ERROR");
                
            }
            res.sendStatus(200,"DELETED");
            
        });
    });
    /*
    // DELETE de un recurso especifico

    app.delete(BASE_API_URL+"/:country/:year",(req, res)=>{
        var countryR = req.params.country;
        var yearR = req.params.year;
        db.find({country: countryR, year: parseInt(yearR)}, {}, (err, filteredList)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredList==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({country: countryR, year: yearR}, {}, (err, numRemoved)=>{
                if (err){
                    res.sendStatus(500,"ERROR EN CLIENTE");
                    return;
                }
            
                res.sendStatus(200,"DELETED");
                return;
                
            });
        });
    });
    */

    /*//DELETE todos los recursos
    app.delete(BASE_API_URL,(req,res)=>{
        nbaStats = [];
        res.sendStatus(200, "Ok");
    });
    */

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
    };

    function pagination(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }
    
        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;
    
    };
};