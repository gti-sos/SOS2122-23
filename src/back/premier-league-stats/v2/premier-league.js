var Datastore = require("nedb");
var db = new Datastore();
var BASE_API_PATH = "/api/v2/premier-league"; 

var premierStats = [];


module.exports.register = (app) => {
    
    //Portal de Documentacion

    app.get(BASE_API_PATH+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19586040/UyrBiFce");
    });

    db.insert(premierStats);

    //Constructor

     //GET inicial (loadInitialData) para inicializar la BD (constructor)

     app.get(BASE_API_PATH+"/loadInitialData",(req,res)=>{

        var statsIni = [
            {country:"England", year:2018, appearences:38, cleanSheets:21, goals:22},
            {country:"England", year:2019, appearences:38, cleanSheets:16, goals:21},
            {country:"Belgium", year:2015, appearences:38, cleanSheets:11, goals:18},
            {country:"Belgium", year:2017, appearences:38, cleanSheets:16, goals:16},
            {country:"Spain", year:2013, appearences:37, cleanSheets:12, goals:9},
            {country:"Spain", year:2020, appearences:37, cleanSheets:10, goals:7},
            {country:"France", year:2016, appearences:37, cleanSheets:15, goals:12},
            {country:"France", year:2014, appearences:38, cleanSheets:8, goals:14},
            {country:"Italy", year:2012, appearences:31, cleanSheets:3, goals:1},
            {country:"Italy", year:2019, appearences:31, cleanSheets:0, goals:4},
            {country:"Ireland", year:2004, appearences:38, cleanSheets:0, goals:11},
            {country:"Ireland", year:2018, appearences:38, cleanSheets:1, goals:5},
            {country:"Wales", year:2011, appearences:37, cleanSheets:3, goals:9},
            {country:"Wales", year:2015, appearences:36, cleanSheets:8, goals:5},
            {country:"Argentina", year:2007, appearences:34, cleanSheets:0, goals:14},
            {country:"Argentina", year:2005, appearences:30, cleanSheets:0, goals:10},
            {country:"Germany", year:2002, appearences:30, cleanSheets:0, goals:2},
            {country:"Germany", year:2017, appearences:38, cleanSheets:10, goals:10},
            {country:"Netherlands", year:2020, appearences:38, cleanSheets:0, goals:10},
            {country:"Netherlands", year:2019, appearences:38, cleanSheets:5, goals:5},
        ];

        // Inicialización base de datos
        //Borra todo lo anterior para evitar duplicidades al hacer loadInitialData
        db.remove({}, { multi: true }, function (err, numRemoved) {
        });

        // Inserta los datos iniciales en la base de datos
        db.insert(statsIni);

        res.send(JSON.stringify(statsIni,null,2));


    });

    /*------------------- GETs -------------------*/

    /*
     //GET A UNA LISTA DE RECURSOS DE PREMIER-LEAGUE-STATS
    app.get(BASE_API_PATH, (req,res)=>{
        var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

        //"Parseamos" los datos a su tipo original antes de buscar
        if (req.query.country) dbquery["country"] = req.query.country;
        if (req.query.year) dbquery["year"] = parseInt(req.query.year);
        if (req.query.appearences) dbquery["appearences"] = parseInt(req.query.appearences);
        if (req.query.cleanSheets) dbquery["cleanSheets"] = parseInt(req.query.cleanSheets);
        if (req.query.goals) dbquery["goals"] = parseInt(req.query.goals);

        //Búsqueda de datos y ordenación por parametro country
        db.find(dbquery).sort({country:1, year:-1}).skip(offset).limit(limit).exec((error, dataPremier) => {
            if (error){
                console.error("Error accessing DB in POST: " + err);
                res.sendStatus(500);
            }else {

            //Se elimina el _id creado automáticamente
            dataPremier.forEach((t) => {
                delete t._id
            });

            res.send(JSON.stringify(dataPremier, null, 2));
            console.log("GET REQUEST have been sent.");
            }
        });
    });

    //GET A UN RECURSO POR COUNTRY
    app.get(BASE_API_PATH+"/:country",(req, res)=>{

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
            return;
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


     //GET A UN RECURSO CONCRETO POR COUNTRY/YEAR    
     app.get(BASE_API_PATH+"/:country/:year", (req, res) => {
        var reqCountry = req.params.country;
        var reqYear = parseInt(req.params.year);

        db.find({ country: reqCountry, year: reqYear }, { _id: 0 }, function (err, data) {
            if (err) {
                console.error("ERROR in GET: "+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){                
                console.log(`NEW GET request to <${reqCountry}>, <${reqYear}>`);
                res.status(200).send(JSON.stringify(data,null,2));
                }else{
                    console.error("Data not found");
                    res.status(404).send("Data not found in DB.");
                }

            }
        });
    });

    */

    //GET ANTONIO
    app.get(BASE_API_PATH,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            // Apartado para búsqueda por año
            
            if(year != null){
                var filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year == year);
                });
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
            }
    
            // Apartado para from y to
            
            if(from != null && to != null){
                filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year >= from && reg.year <=to);
                });
    
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }    

                
            }
            // RESULTADO
    
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "appearences" && element != "cleanSheets" && element != "goals"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })
    })
    
    // GET por país
    
    app.get(BASE_API_PATH+"/:country",(req, res)=>{
    
        var country =req.params.country;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function(err,filteredList){
            
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country);
            });
        
            // Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;
    
            //Comprobamos si from es mas pequeño o igual a to
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        
            if(from != null && to != null && from<=to){
                filteredList = filteredList.filter((reg)=>
                {
                   return (reg.year >= from && reg.year <=to);
                }); 
                
            }
            //COMPROBAMOS SI EXISTE
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            //RESULTADO
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "appearences" && element != "cleanSheets" && element != "goals"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })

    })
    
    // GET por país y año
    
    app.get(BASE_API_PATH+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
    
            //RESULTADO
    
            //Paginación
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
                res.send(JSON.stringify(filteredList,null,2));
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "appearences" && element != "cleanSheets" && element != "goals"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList[0],null,2));
        });

    })
    /*------------------- POSTs -------------------*/


    //POST A LA LISTA DE RECURSOS DE PREMIER-LEAGUE-STATS 
    app.post(BASE_API_PATH,(req,res)=>{
        var dataNew = req.body;
        var countryNew = req.body.country;
        var yearNew = req.body.year;
        
        
        db.find({ country: countryNew, year: yearNew }, (err, data) => {
            if (err) {
                console.error("Error accessing DB in POST: " + err);
                res.sendStatus(500);
            } else {
                if (data.length == 0) {
                    if (!dataNew.country ||
                        !dataNew.year ||
                        !dataNew.appearences ||
                        !dataNew.cleanSheets ||
                        !dataNew.goals) {
                        console.log("Number of parameters is incorrect.");
                        res.sendStatus(400,"FORMAT INCORRETCT");
                    }else {
                        console.log("Inserting new data in DB: " + JSON.stringify(dataNew, null, 2));
                        db.insert(dataNew);
                        res.sendStatus(201,"CREATED");                    }
                } else {
                    console.log("Conflit is detected.");
                    res.sendStatus(409);
                }
            }
        });
    });

     //POST A UN RECURSO(No está permitido)
     app.post(BASE_API_PATH+"/:country/:year",(req,res)=>{
        res.sendStatus(405);
        console.log("Se ha intentado hacer POST a un recurso concreto.");
    });

    /*------------------- PUTs -------------------*/

     //PUT A UN RECURSO CONCRETO POR COUNTRY/YEAR
     app.put(BASE_API_PATH+"/:country/:year", (req,res) => {
        
        var reqcountry = req.params.country;
        var reqyear = parseInt(req.params.year);
        var data = req.body;

        if (Object.keys(data).length != 5) {
            console.log("Actualizacion de campos no valida");
            res.sendStatus(400, "BAD REQUEST - Parametros incorrectos");
        }        
        else {
            db.update({ country: reqcountry, year: reqyear }, { $set: data }, {}, function (err, dataUpdate) {
                if (err) {
                    console.error("ERROR accesing DB in GET");
                    res.sendStatus(500);
                } else {
                    if (dataUpdate == 0) {
                        console.error("No data found");
                        res.sendStatus(404);
                    } else {
                        console.log("Campos actualizados")
                        res.sendStatus(200);
                    }
                }
            });
        }
    });

     //PUT A UNA LISTA DE RECURSOS DE DEFENSEs STATS (Debe dar error)
     app.put(BASE_API_PATH,(req,res) => {
        res.sendStatus(405);
    });



    /*------------------- DELETEs -------------------*/


     //DELETE A LISTA DE RECURSOS
     app.delete(BASE_API_PATH, (req,res) => {
        db.remove({}, {multi: true}, (err, numDataRemoved) => {
            if (err || numDataRemoved == 0){
                console.log("ERROR deleting DB: "+err);
                res.sendStatus(500);
            }else{
                console.log(numDataRemoved+" has been successfully deleted from the BD.");
                res.sendStatus(200);
            }
        });
    });

    //DELETE A UN RECURSO POR COUNTRY/YEAR
    app.delete(BASE_API_PATH + "/:country/:year", (req,res)=>{
        var reqcountry = req.params.country;
        var reqyear = parseInt(req.params.year);
        db.remove({country : reqcountry, year : reqyear},{multi:true}, (err, data) => {
            if (err) {
                console.error("ERROR in GET");
                res.sendStatus(500);
            } else {
                if(data != 0){
                    console.log(`NEW DELETE request to <${reqcountry}>, <${reqyear}>`);
                    res.status(200).send("The corresponding data for " + reqcountry + " and " + reqyear + " has been deleted");
                }else{
                    console.log("Data not found");
                    res.sendStatus(404);
                }
            }
        });
    });

    function paginacion(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }

        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;

    }

    function comprobar_fields(req, lista){
        var fields = req.query.fields;

        var contieneCountry = false;
        var contieneYear = false;
        var contieneAppearences = false;
        var contieneCleanSheets = false;
        var contieneGoals = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                contieneCountry=true;
            }
            if(element=='year'){
                contieneYear=true;
            }
            if(element=='appearences'){
                contieneAppearences=true;
            }
            if(element=='cleanSheets'){
                contieneCleanSheets=true;
            }
            if(element=='goals'){
                contieneGoals=true;
            }
        }

        //Country
        if(!contieneCountry){
            lista.forEach((element)=>{
                delete element.country;
            })
        }

        //Year
        if(!contieneYear){
            lista.forEach((element)=>{
                delete element.year;
            })
        }

        //appearences
        if(!contieneAppearences){
            lista.forEach((element)=>{
                delete element.appearences;
            })
        }

        //cleanSheets
        if(!contieneCleanSheets){
            lista.forEach((element)=>{
                delete element.cleanSheets;
            })
        }

        //goals
        if(!contieneGoals){
            lista.forEach((element)=>{
                delete element.goals;
            })
        }

        return lista;

    }


};