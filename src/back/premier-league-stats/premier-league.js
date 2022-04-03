module.exports = (app) => {
const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();

const BASE_API_URL = "/api/v1";
const OWN_API_URL = "/premier-league";
const path = require("path");
const pman = "https://documenter.getpostman.com/view/19586040/UVyn2yuS";


    app.use(bodyParser.json());

    //Variable

    var stats = [
        {
            countries:"England",
            years:2018,
            appearences:38,
            cleanSheets:21,
            goals:22
        },
        {
            countries:"England",
            years:2019,
            appearences:38,
            cleanSheets:16,
            goals:21
        },
        {
            countries:"Belgium",
            years:2015,
            appearences:38,
            cleanSheets:11,
            goals:18
        },
        {
            countries:"Belgium",
            years:2017,
            appearences:38,
            cleanSheets:16,
            goals:16
        },
        {
            countries:"Spain",
            years:2013,
            appearences:37,
            cleanSheets:12,
            goals:9
        },
        {
            countries:"Spain",
            years:2020,
            appearences:37,
            cleanSheets:10,
            goals:7
        }
    ];

    //Inicializar la base de datos
    db.insert(stats);

    //Redirigir a postman
    app.get(BASE_API_URL + OWN_API_URL + "/docs",(req,res)=>{
        res.redirect(pman);
    });

    //InitialLoad
    app.get(BASE_API_URL + OWN_API_URL + "/loadInitialData", (req,res)=> {
        db.remove({},{multi:true},function(err,data){
        });
        var statsIni = [
            {
                countries:"England",
                years:2018,
                appearences:38,
                cleanSheets:21,
                goals:22
            },
            {
                countries:"England",
                years:2019,
                appearences:38,
                cleanSheets:16,
                goals:21
            },
            {
                countries:"Belgium",
                years:2015,
                appearences:38,
                cleanSheets:11,
                goals:18
            },
            {
                countries:"Belgium",
                years:2017,
                appearences:38,
                cleanSheets:16,
                goals:16
            },
            {
                countries:"Spain",
                years:2013,
                appearences:37,
                cleanSheets:12,
                goals:9
            },
            {
                countries:"Spain",
                years:2020,
                appearences:37,
                cleanSheets:10,
                goals:7
            }
        ];
            db.insert(statsIni);
            res.send(JSON.stringify(statsIni,null,2));
    });

    //GET CONJUNTO
    
    app.get(BASE_API_URL + OWN_API_URL,(req,res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((c)=>{
                return {countries : c.countries, years : c.years, appearences : c.appearences, goals : c.goals, cleanSheets : c.cleanSheets};
                // It is needed to do a map to the db so the 'id' doesn't show up
            }),null,2));
        });
    });

    //GET DATO

    app.get(BASE_API_URL + OWN_API_URL + "/:countries", (req, res)=>{ 
        var Countries = req.params.countries;

        db.find({countries : Countries},{_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET"+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else {
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });

    });

    //GET DATO ESPECÍFICO

    app.get(BASE_API_URL + OWN_API_URL + "/:countries/:years", (req, res)=>{
        var ccCountry = req.params.countries;
        var ccYear = parseInt(req.params.years);

        db.find({countries : ccCountry, years: ccYear}, {_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET: "+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else{
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });

    });

    // POST

    app.post(BASE_API_URL + OWN_API_URL,(req,res)=>{
        
        cc_body = req.body;
        cc_country = req.body.countries;
        cc_year = parseInt(req.body.years);

        db.find({countries : cc_country, years : cc_year}, function(err,data){
            if(err){
                console.error("ERROR POST: "+err);
                res.sendStatus(500);
            } else {
                if(data.length == 0){
                    if(!cc_body.countries || !cc_body.years || !cc_body.appearences || !cc_body.cleanSheets || !cc_body.goals){
                        console.log("Data is missing or incorrect. Perhaps number of parameters is incorrect?");
                        return res.sendStatus(400);
                    } else {
                        db.insert(cc_body);
                        return res.status(201).send(JSON.stringify(cc_body,null,2));
                        // CANT SEPARATE "status" FROM "send" IN DIFFERENT LINES. CRASHES.
                    }
                } else {
                    console.log("Conflict");
                    res.sendStatus(409);
                 }
            }
        });
    });

    // POST - ELEMENT (405) 

    app.post(BASE_API_URL + OWN_API_URL + "/:countries/:years",(req,res)=>{
        res.sendStatus(405, "Unable to POST an element");
    });
    

    // DELETE - RESOURCE
    app.delete(BASE_API_URL + OWN_API_URL, (req, res)=>{
        db.remove({},{multi:true}, function (err,dbRemoved){
            if(err || dbRemoved == 0){
                console.log("ERROR IN DELETING DB:"+err);
                res.sendStatus(500);
            } else{
                console.log("The database has been successfully removed.");
                res.sendStatus(200);
            }
        });
    });

     // DELETE - ELEMENT
     app.delete(BASE_API_URL + OWN_API_URL + "/:countries/:years", (req, res)=>{
        var ccCountry = req.params.countries;
        var ccYear = parseInt(req.params.years);

        db.remove({countries : ccCountry, years : ccYear},{multi:true},function(err,data){
            if(err){
                console.error(err);
                res.sendStatus(500);
            } else if(data == 0){
                console.log("Data not found in database.");
                res.status(404);
            } else {
                console.log("DELETE REQUEST");
                res.status(200).send("All data with "+ccCountry+" and "+ccYear+" has been removed.")
            }
        });
        
        
    });

    // PUT - RESOURCE
    app.put(BASE_API_URL + OWN_API_URL, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    // PUT - SUBRESOURCE
    app.put(BASE_API_URL + OWN_API_URL + "/:countries", (req,res)=>{
        res.sendStatus(405,"UnabLe to PUT a resource list");
    });

    // PUT - ELEMENT
    app.put(BASE_API_URL + OWN_API_URL + "/:countries/:years", (req,res)=>{
        var cc_body = req.body;             // resource updated

        var ccCountry = req.params.countries;
        var ccYear = parseInt(req.params.years);

        if(!cc_body.countries || !cc_body.years || !cc_body.goals || !cc_body.appearences || !cc_body.cleanSheets){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            db.update({$and: [{countries:ccCountry},{years:ccYear}]}, {$set:cc_body},{},function(err,data){
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    if(data == 0){
                        console.log("Data not found");
                        res.sendStatus(404,"Data not found");
                    } else {
                        console.log("Data updated.");
                        res.sendStatus(200,"Element successfully updated.");
                    }
                }
            });
            
        }
    });

        //GET Datos Iniciales
        //app.get(BASE_API_URL + OWN_API_URL + "/loadInitialData",(req,res)=>{
        //    if(stats.length===0){
        //        stats.forEach((a)=>{
        //            stats.push(a);
        //        });
        //        res.send(JSON.stringify(stats,null,2));
        //    }
        //    else{
        //        res.send(JSON.stringify(stats,null,2));
        //    }
        //   
        //});
        

        //GET CONJUNTO
        //app.get(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        //    res.send(JSON.stringify(stats, null,2)); // devuelve el conjunto 
        //});
        //
        ////DELETE CONJUNTO
        //app.delete(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        //    stats = []; // deja vacio el conjunto
        //    console.log("HOLA");
        //    res.sendStatus(200, "OK"); // devuelve codigo correcto
        //});
        ////GET ELEMENTO POR PAIS
        //app.get(BASE_API_URL + OWN_API_URL+"/:countries", (req,res)=>{
        //    var countries = req.params.countries    ; // guarda el pais de la peticion
        //    filteredCountry = stats.filter((cont) =>{ // filtra por el pais 
        //    return (cont.countries == countries); 
        //    
        //    });
        // 
        //    if(filteredCountry == 0){ // si devuelve falso devuelve error de no encontrado
        //        res.sendStatus(404, "NOT FOUND");
        //    }else{
        //        res.send(JSON.stringify(filteredCountry, null,2)); // si devuelve true devuelve los que coinciden.
        //    }
        //    console.log(filteredCountry);
        //});
        //
        ////GET ELEMENTO POR PAIS Y ANYO
        //app.get(BASE_API_URL + OWN_API_URL+"/:countries/:years", (req,res)=>{
        //    var countries = req.params.countries; // guarda el pais de la peticion
        //    var yearsName = req.params.years; // guarda el anyo de la peticion
        //    filteredYear = stats.filter((cont) =>{ 
        //    return (cont.countries == countries) && (cont.years == yearsName); // filtra los que coinciden con el anyo y el pais de la peticion 
        //    });
        //
        //    if(filteredYear == 0){ // si es 0(falso) devuelve error de no encontrado
        //        res.sendStatus(404, "NOT FOUND");
        //    }else{
        //        res.send(JSON.stringify(filteredYear, null,2)); // si es verdadero devuelve los valores que coinciden con el filtrado.
        //    }
        //});
        //
        ////POST CONJUNTO // BIEN
        //app.post(BASE_API_URL + OWN_API_URL, (req,res)=>{
        //    var newData = req.body;
        //    var years = req.body.year;
        //    var countries = req.body.countries;
        //
        //    for(let i = 0;i<stats.length;i++){
        //        let elem = stats[i];
        //        if(elem.years === years || elem.countries === countries){
        //            res.sendStatus(409,"Conflict");
        //        }
        //    }
        //    stats.push(req.body); // anyade lo que le pasemos en el cuerpo de la peticion
        //    res.sendStatus(201, "CREATED"); // devuelve codigo correcto
        //});
        //
        ////POST RECURSO ERROR
        //app.post(BASE_API_URL + OWN_API_URL+ "/:countries", (req,res)=>{
        //    res.sendStatus(405, "Method Not Allowed"); // devuelve codigo method not allowed
        //});
        //
        ////DELETE CONJUNTO
        //app.delete(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        //    stats = []; // deja vacio el conjunto
        //    res.sendStatus(200, "OK"); // devuelve codigo correcto
        //});
        //
        ////DELETE ELEMENTO POR PAIS
        //app.delete(BASE_API_URL + OWN_API_URL+"/:countries", (req,res)=>{ //borrar todos los recursos
        //    var countries = req.params.countries; // pais de la peticion 
        //    stats = stats.filter((cont) =>{ // filtrar pais que coindice con la peticion
        //        return (cont.countries != countries); 
        //    });
        //    res.send(JSON.stringify(stats, null,2));
        //    res.sendStatus(200, "OK");
        //});
        //
        //// DELETE ELEMENTO POR PAIS Y ANYO
        //app.delete(BASE_API_URL + OWN_API_URL+"/:countries/:years", (req,res)=>{ //borrar todos los recursos
        //    var countries = req.params.countries; //pais de la peticion
        //    var yearsName = req.params.years; //anyo de la peticion
        //    stats.filter((cont) =>{
        //        return (cont.countries != countries) && (cont.years != yearsName); //comprobar que el pais y el anyo de la peticion coindice mediante filtrado
        //    });
        //    res.send(JSON.stringify(stats, null,2));
        //    res.sendStatus(200, "OK"); // devolver codigo de ok 
        //});
        //
        //app.put(BASE_API_URL + OWN_API_URL, (req,res)=>{ //borrar todos los recursos
        //    res.sendStatus(400, "Bad Request"); // devolver codigo de ok 
        //});
        //
        //// Actualización recurso concreto
        //app.put(BASE_API_URL+OWN_API_URL+"/:countries/:years",(req,res)=>{
        //    if(req.body.countries == null |
        //        req.body.years == null | 
        //        req.body.appearences == null | 
        //        req.body.cleanSheets == null | 
        //        req.body.goals == null){
        //        res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        //    }else{
        //        var countries = req.params.countries;
        //        var years = req.params.years;
        //        var body = req.body;
        //        var index = stats.findIndex((reg) =>{
        //            return (reg.countries == countries && reg.years == years)
        //        })
        //        if(index == null){
        //            res.sendStatus(404,"NOT FOUND");
        //        }else if(countries != body.countries || years != body.years){
        //            res.sendStatus(400,"BAD REQUEST");
        //        }else{
        //            var update_landusage = {...body};
        //            stats[index] = update_landusage;
        //
        //            res.sendStatus(200,"UPDATED");
        //        }
        //    }
        //
        //});
        //
        ////POST CONJUNTO
        //app.post(BASE_API_URL + OWN_API_URL, (req,res)=>{
        //    var newData = req.body;
        //    var years = req.body.years;
        //    var countries = req.body.countries;
        //
        //    if(!newData.years ||
        //        !newData.countries ||
        //        !newData.appearences||
        //        !newData.cleanSheets||
        //        !newData.goals){
        //            res.sendStatus(400,"Bad Request");
        //        }
        //    else{
        //        for(let i = 0;i<stats.length;i++){
        //            let elem = stats[i];
        //            if(elem.years === years && elem.countries === countries){
        //                res.sendStatus(409,"Conflict");
        //            }
        //        }
        //        stats.push(req.body); // anyade lo que le pasemos en el cuerpo de la peticion
        //        res.sendStatus(201, "CREATED"); // devuelve codigo correcto
        //    }
        //
        //    
        //});
        
    }