var Datastore = require("nedb");
var db = new Datastore();
var BASE_API_PATH = "/api/v2/premier-league"; 

var defenseStats = [];


module.exports.register = (app) => {
    
    //Portal de Documentacion

    app.get(BASE_API_PATH+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19586040/UVyn2yuS");
    });

    db.insert(defenseStats);

    //Constructor

     //GET inicial (loadInitialData) para inicializar la BD (constructor)

     app.get(BASE_API_PATH+"/loadInitialData",(req,res)=>{

        var statsIni = [
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

        // Inicialización base de datos
        //Borra todo lo anterior para evitar duplicidades al hacer loadInitialData
        db.remove({}, { multi: true }, function (err, numRemoved) {
        });

        // Inserta los datos iniciales en la base de datos
        db.insert(statsIni);

        res.send(JSON.stringify(statsIni,null,2));


    });

    /*------------------- GETs -------------------*/


     //GET A UNA LISTA DE RECURSOS DE PREMIER-LEAGUE-STATS
    app.get(BASE_API_PATH, (req,res)=>{
        var query = req.query;
        var limit = parseInt(query.limit);
        var offset = parseInt(query.offset);
        var dbquery = {};

        //"Parseamos" los datos a su tipo original antes de buscar
        if (req.query.country) dbquery["country"] = req.query.country;
        if (req.query.year) dbquery["year"] = parseInt(req.query.year);
        if (req.query.appearences) dbquery["appearences"] = parseFloat(req.query.appearences);
        if (req.query.cleanSheets) dbquery["cleanSheets"] = parseFloat(req.query.cleanSheets);
        if (req.query.goals) dbquery["goals"] = parseFloat(req.query.goals);

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


     //GET A UN RECURSO CONCRETO DE SMOKER POR COUNTRY/YEAR    
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
                        return res.status(400).send("Format incorrect.");
                    }else {
                        console.log("Inserting new data in DB: " + JSON.stringify(dataNew, null, 2));
                        db.insert(dataNew);
                        return res.status(201).send("Se ha creado correctamente: " +JSON.stringify(dataNew, null, 2));
                    }
                } else {
                    console.log("Conflit is detected.");
                    res.sendStatus(409);
                }
            }
        });
    });

     //POST A UN RECURSO DE DEFENSE (No está permitido)
     app.post(BASE_API_PATH+"/:country/:year",(req,res)=>{
        res.sendStatus(405);
        console.log("Se ha intentado hacer POST a un recurso concreto.");
    });

    /*------------------- PUTs -------------------*/

     //PUT A UN RECURSO CONCRETO DE DEFENSE POR COUNTRY/YEAR
     app.put(BASE_API_PATH+"/:country/:year", (req,res) => {
        
        var reqcountry = req.params.country;
        var reqyear = parseInt(req.params.year);
        var data = req.body;

        if (Object.keys(data).length != 7) {
            console.log("Actualizacion de campos no valida");
            res.sendStatus(400);
        }else {
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


     //DELETE A LISTA DE RECURSOS DE DEFENSE STATS
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

    //DELETE A UN RECURSO DE DEFENSE POR COUNTRY/YEAR
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

};