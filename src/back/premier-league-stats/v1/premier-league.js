const bodyParser = require("body-parser");
const res = require("express/lib/response");
const BASE_API_URL = "/api/v1/premier-league";
const pman = "https://documenter.getpostman.com/view/19586040/UVyn2yuS";

//Array de objetos

var stats = [
    {
        country:"England",
        year:2018,
        appearences:38,
        cleanSheets:21,
        goals:22
    },
    {
        country:"England",
        year:2019,
        appearences:38,
        cleanSheets:16,
        goals:21
    },
    {
        country:"Belgium",
        year:2015,
        appearences:38,
        cleanSheets:11,
        goals:18
    },
    {
        country:"Belgium",
        year:2017,
        appearences:38,
        cleanSheets:16,
        goals:16
    },
    {
        country:"Spain",
        year:2013,
        appearences:37,
        cleanSheets:12,
        goals:9
    },
    {
        country:"Spain",
        year:2020,
        appearences:37,
        cleanSheets:10,
        goals:7
    }
];


module.exports.register = (app,db) => {

//Portal de Documentacion

app.get(BASE_API_URL+"/docs",(req,res)=>
{
    res.redirect(pman);
});



//Cargar Datos Iniciales

app.get(BASE_API_URL+"/loadInitialData",(req,res)=>{

    db.find({}, function(err,filteredList){

        if(err){
            res.sendStatus(500, "CLIENT ERROR");
        
        }
        if(filteredList==0){
            for(var i = 0; i<stats.length;i++){
                db.insert(stats[i]);
            }
            res.sendStatus(200,"OK");
            
        }
    });

});

//Metodo auxiliar

function check_body(req){
    return (req.body.country == null |
             req.body.year == null | 
             req.body.appearences == null | 
             req.body.cleanSheets == null | 
             req.body.goals == null);
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



//GETs

//GET Global y a??os

app.get(BASE_API_URL,(req,res)=>{
    var year = req.query.year;
    var from = req.query.from;
    var to   = req.query.to;

    //Comprobaciones
    //Comprobacion query 

    for(var i = 0; i<Object.keys(req.query).length;i++){
        var element = Object.keys(req.query)[i];
        if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset"){
            res.sendStatus(400, "BAD REQUEST");
            
        }
    }
    
    //Comprobacion from menor que to

    if(from>to){
        res.sendStatus(400, "BAD REQUEST");
        
    }

    db.find({},function(err, filteredList){

        if(err){
            res.sendStatus(500, "CLIENT ERROR");   
        }

        // Apartado para b??squeda por a??o
        
        if(year != null){
            var filteredList = filteredList.filter((reg)=>
            {
                return (reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NOT FOUND");     
            }
        }

        // Apartado para from y to
        
        if(from != null && to != null){
            filteredList = filteredList.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });

            if (filteredList==0){
                res.sendStatus(404, "NOT FOUND");
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

//GET Pais y opcion entre a??os

app.get(BASE_API_URL+"/:country",(req, res)=>{

    var country =req.params.country
    var from = req.query.from;
    var to = req.query.to;

    //Comprobaciones
    //Comprobaciones query
    
    for(var i = 0; i<Object.keys(req.query).length;i++){
        var element = Object.keys(req.query)[i];
        if(element != "from" && element != "to"){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
    }

     //Comprobacion from menor que to

     if(from>to){
        res.sendStatus(400, "BAD REQUEST");
        
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


//GET por Pais y A??o

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

        //Paginaci??n
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

//POSTs

//POST resources list

app.post(BASE_API_URL,(req, res)=>{
    
    //Comprobamos formato JSON
    if(check_body(req)){
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
// POST para recurso concreto

app.post(BASE_API_URL+"/:country",(req, res)=>{
    res.sendStatus(405,"METHOD NOT ALLOWED");
});


//PUTs

// PUT de una lista de recursos

app.put(BASE_API_URL,(req, res)=>{
    
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

// PUT de un recurso especifico

app.put(BASE_API_URL+"/:country/:year",(req, res)=>{
    
    //Comprobamos formato JSON
    if(check_body(req)){
        res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
    }
    var countryR = req.params.country;
    var yearR = req.params.year;
    var body = req.body;  

    db.find({},function(err,filteredList){
            if(err){
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            //COMPROBAMOS SI EXISTE EL ELEMENTO

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList==0){
                res.sendStatus(404, "NOT FOUND");
                return;
            }

            //COMPROBAMOS SI LOS CAMPOS ACTUALIZADOS SON IGUALES

            if(countryR != body.country || yearR != body.year){
                res.sendStatus(400,"BAD REQUEST");
                return;
            }

            //ACTUALIZAMOS VALOR
                
            db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "CLIENT ERROR");
                    return;
                }else{
                    res.sendStatus(200,"UPDATED");
                    return;
                }
            });
    });   
    

});

// DELETEs

// DELETE de una lista de recursos

app.delete(BASE_API_URL,(req, res)=>{
    db.remove({}, { multi: true }, (err, numRemoved)=>{
        if (err){
            res.sendStatus(500,"CLIENT ERROR");
            
        }
        res.sendStatus(200,"DELETED");
        
    });
});

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

};