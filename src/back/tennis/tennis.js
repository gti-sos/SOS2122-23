const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();

    //URL 
const BASE_API_URL= "/api/v1";
const API_NAME = "/tennis";
const API_DOC_CC = "https://documenter.getpostman.com/view/19996738/UVysxGDk";


module.exports = (app) => {
    console.log("Exporting Tennis API");
    
    
    

    app.use(bodyParser.json());

    // resource variable
    var tennis = [
        {
            "country": "serbia",
            "year": 2019,
            "most_grand_slam": 2,
            "masters_finals": 3,
            "olympic_gold_medals": 0
        },
        {
            "country": "japan",
            "year": 2020,
            "most_grand_slam": 0,
            "masters_finals": 0,
            "olympic_gold_medals": 0
        }

    ];

    

    db.insert(tennis); //database initialized 
 
    // Redirect to POSTMAN
    app.get(BASE_API_URL + API_NAME +"/docs", (req,res) => {
        res.redirect(API_DOC_CC);
    });


    //Initial Load 
    app.get(BASE_API_URL + API_NAME + "/loadInitialData", (req,res)=> {
            db.remove({},{multi:true},function(err,data){
            });
            var tennisInitial = [
                {
                    "country": "serbia",
                    "year": 2019,
                    "most_grand_slam": 2,
                    "masters_finals": 3,
                    "olympic_gold_medals": 0
                },
                {
                    "country": "spain",
                    "year": 2019,
                    "most_grand_slam": 2,
                    "masters_finals": 2,
                    "olympic_gold_medals": 0
                },
                {
                    "country": "great-britain",
                    "year": 2012,
                    "most_grand_slam": 1,
                    "masters_finals": 0,
                    "olympic_gold_medals": 1
                },
                {
                    "country": "russia",
                    "year": 2021,
                    "most_grand_slam": 1,
                    "masters_finals": 1,
                    "olympic_gold_medals": 0
                },
                {
                    "country": "swirtzeland",
                    "year": 2008,
                    "most_grand_slam": 1,
                    "masters_finals": 0,
                    "olympic_gold_medals": 0
                }
    
        ];
            db.insert(tennisInitial);
            res.send(JSON.stringify(tennisInitial,null,2));
    });

    // GET - RESOURCE
    
    /*app.get(BASE_API_URL + API_NAME,(req,res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((c)=>{
                return {country : c.country, year : c.year, most_grand_slam : c.most_grand_slam, masters_finals : c.masters_finals, olympic_gold_medals : c.olympic_gold_medals};
                // It is needed to do a map to the db so the 'id' doesn't show up
            }),null,2));
        });
        

    });
    */

    app.get(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        var query = req.query;
        dbquery = {};
        console.log("Peticion GET");
        console.log(query.year);
        var limit = Number.MAX_SAFE_INTEGER;
        var offset = 0;
        if(query.offset){
            offset = parseInt(query.offset);
            console.log(offset);
            delete query.offset;
        }
        if(query.limit){
            limit = parseInt(query.limit);
            delete query.limit;
        }
        if(query.year){
            dbquery['year'] = parseInt(query.year);
            console.log(offset);
        }
        if(query.most_grand_slam){
            dbquery['most_grand_slam'] = parseFloat(query.most_grand_slam);
        }
        if(query.masters_finals){
            dbquery['masters_finals'] = parseFloat(query.masters_finals);
        }
        if(query.olympic_gold_medals){
            dbquery['olympic_gold_medals'] = parseFloat(query.olympic_gold_medals);
        }
        
        console.log(dbquery);
        db.find(dbquery).skip(offset).limit(limit).exec((err,docs) =>{
            console.log(docs);
            if(err){
                res.sendStatus(500);
            }
            else{
                if(docs == 0){
                    res.sendStatus(404);
                }
                else{
                    docs.forEach((data) => {
                        delete data._id;
                    });
                    res.status(200).send(JSON.stringify(docs,null,2));
                }
            }
        })
        //res.send(JSON.stringify(landusage_stats_copy, null,2)); // devuelve el conjunto 
    });

/*          ALTERNATIVE GET RESOURCE
    app.get(BASE_API_URL + url_sergio,(req,res)=>{
        var query = req.query;
        var dbInit = {};
        var offset = parseInt(query.offset);
        var limit = parseInt(query.limit);
        // PARSERS
        if(query.country) dbInit["country"] = query.country;
        if(query.year) dbInit["year"] = parseInt(query.year);
        if(query.ccelectr) dbInit["ccelectr"] = parseFloat(query.ccelectr);
        if(query.ccdemand) dbInit["ccdemand"] = parseFloat(query.ccdemand);
        if(query.ccmining) dbInit["ccmining"] = parseFloat(query.ccmining);
        // 1 --> regular order
        // -1 --> reverse order
        db.find(dbInit).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error,cryptocoin)=>{
            cryptocoin.forEach((c)=>{
                delete c._id
            });
            res.send(JSON.stringify(cryptocoin,null,2));
            console.log("GET REQUEST have been sent.")
        });
 
    });
*/


    // GET - SUBREPOSITORY - COUNTRY
    app.get(BASE_API_URL + API_NAME + "/:country", (req, res)=>{ 
        var ccCountry = req.params.country;

        db.find({country : ccCountry},{_id:0}, function(err,data){
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


    // GET - ELEMENT
    app.get(BASE_API_URL + API_NAME + "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        db.find({country : ccCountry, year: ccYear}, {_id:0}, function(err,data){
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

    // POST - RESOURCE
    app.post(BASE_API_URL + API_NAME,(req,res)=>{
        
        cc_body = req.body;
        cc_country = req.body.country;
        cc_year = parseInt(req.body.year);

        db.find({country: cc_country, year: cc_year}, function(err,data){
            if(err){
                console.error("ERROR POST: "+err);
                res.sendStatus(500);
            } else {
                if(data.length == 0){
                    if(!cc_body.country || !cc_body.year || !cc_body.most_grand_slam || !cc_body.masters_finals || !cc_body.olympic_gold_medals){
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
    app.post(BASE_API_URL + API_NAME + "/:country/:year",(req,res)=>{
        res.sendStatus(405, "Unable to POST a element");
    });


    // DELETE - RESOURCE
    app.delete(BASE_API_URL + API_NAME, (req, res)=>{
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
    app.delete(BASE_API_URL + API_NAME+ "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        db.remove({country : ccCountry, year : ccYear},{multi:true},function(err,data){
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
    app.put(BASE_API_URL + API_NAME, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    // PUT - SUBRESOURCE
    app.put(BASE_API_URL + API_NAME + "/:country", (req,res)=>{
        res.sendStatus(405,"UnabLe to PUT a resource list");
    });

    // PUT - ELEMENT
    app.put(BASE_API_URL + API_NAME + "/:country/:year", (req,res)=>{
        var cc_body = req.body;             // resource updated

        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        if(!cc_body.country || !cc_body.year || !cc_body.most_grand_slam || !cc_body.masters_finals || !cc_body.olympic_gold_medals){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            db.update({$and: [{country:ccCountry},{year:ccYear}]}, {$set:cc_body},{},function(err,data){
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

};






// ------------------------ CÓDIGO ANTES DE BASE DE DATOS ------------------------------ //

/*              
module.exports.register = (app) => {
    const BASE_API_URL = "/api/v1";
    const OWN_API_URL = "/tennis";
    const path = require("path");
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    
    var tennis = [
        {
        countries: "serbia",
        years: 2019,
        most_grand_slam: 2,
        masters_finals: 3,
        olympic_gold_medals: 0
        },];
        
    var tennis_initial = [
        {
            countries: "serbia",
            years: 2019,
            most_grand_slam: 2,
            masters_finals: 3,
            olympic_gold_medals: 0
        },
        {
            countries: "spain",
            years: 2019,
            most_grand_slam: 2,
            masters_finals: 2,
            olympic_gold_medals: 0
        },
        {
            countries: "great-britain",
            years: 2012,
            most_grand_slam: 1,
            masters_finals: 0,
            olympic_gold_medals: 1
        },
        {
            countries: "russia",
            years: 2021,
            most_grand_slam: 1,
            masters_finals: 1,
            olympic_gold_medals: 0
        },
        {
            countries: "swirtzeland",
            years: 2008,
            most_grand_slam: 1,
            masters_finals: 0,
            olympic_gold_medals: 0
        },
    ];
    
    //GET Datos Iniciales
    app.get(BASE_API_URL + OWN_API_URL + "/loadInitialData",(req,res)=>{
        if(tennis.length===0){
            tennis_initial.forEach((a)=>{
                tennis.push(a);
            });
            res.send(JSON.stringify(tennis,null,2));
        }
        else{
            res.send(JSON.stringify(tennis,null,2));
        }
       
    });
    
    app.get(BASE_API_URL + OWN_API_URL + "/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/19996738/UVyn2yXM");
    })
    
    //GET CONJUNTO
    app.get(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        res.send(JSON.stringify(tennis, null,2)); // devuelve el conjunto 
    });
    
    //DELETE CONJUNTO
    app.delete(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        tennis = []; // deja vacio el conjunto
        console.log("HOLA");
        res.sendStatus(200, "OK"); // devuelve codigo correcto
    });
    //GET ELEMENTO POR PAIS
    app.get(BASE_API_URL + OWN_API_URL+"/:countries", (req,res)=>{
        var countries = req.params.countries    ; // guarda el pais de la peticion
        filteredCountry = tennis.filter((cont) =>{ // filtra por el pais 
        return (cont.countries == countries); 
        
        });
     
        if(filteredCountry == 0){ // si devuelve falso devuelve error de no encontrado
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredCountry, null,2)); // si devuelve true devuelve los que coinciden.
        }
        console.log(filteredCountry);
    });
    
    //GET ELEMENTO POR PAIS Y ANYO
    app.get(BASE_API_URL + OWN_API_URL+"/:countries/:years", (req,res)=>{
        var countries = req.params.countries; // guarda el pais de la peticion
        var yearsName = req.params.years; // guarda el anyo de la peticion
        filteredYear = tennis.filter((cont) =>{ 
        return (cont.countries == countries) && (cont.years == yearsName); // filtra los que coinciden con el anyo y el pais de la peticion 
        });
    
        if(filteredYear == 0){ // si es 0(falso) devuelve error de no encontrado
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredYear, null,2)); // si es verdadero devuelve los valores que coinciden con el filtrado.
        }
    });
    
    //POST CONJUNTO // BIEN
    app.post(BASE_API_URL + OWN_API_URL, (req,res)=>{
        var newData = req.body;
        var years = req.body.year;
        var countries = req.body.countries;
    
        for(let i = 0;i<tennis.length;i++){
            let elem = tennis[i];
            if(elem.years === years || elem.countries === countries){
                res.sendStatus(409,"Conflict");
            }
        }
        tennis.push(req.body); // anyade lo que le pasemos en el cuerpo de la peticion
        res.sendStatus(201, "CREATED"); // devuelve codigo correcto
    });
    
    //POST RECURSO ERROR
    app.post(BASE_API_URL + OWN_API_URL+ "/:countries", (req,res)=>{
        res.sendStatus(405, "Method Not Allowed"); // devuelve codigo method not allowed
    });
    
    //DELETE CONJUNTO
    app.delete(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        tennis = []; // deja vacio el conjunto
        res.sendStatus(200, "OK"); // devuelve codigo correcto
    });
    
    //DELETE ELEMENTO POR PAIS
    app.delete(BASE_API_URL + OWN_API_URL+"/:countries", (req,res)=>{ //borrar todos los recursos
        var countries = req.params.countries; // pais de la peticion 
        tennis = tennis.filter((cont) =>{ // filtrar pais que coindice con la peticion
            return (cont.countries != countries); 
        });
        res.send(JSON.stringify(tennis, null,2));
        res.sendStatus(200, "OK");
    });
    
    // DELETE ELEMENTO POR PAIS Y ANYO
    app.delete(BASE_API_URL + OWN_API_URL+"/:countries/:years", (req,res)=>{ //borrar todos los recursos
        var countries = req.params.countries; //pais de la peticion
        var yearsName = req.params.years; //anyo de la peticion
        tennis.filter((cont) =>{
            return (cont.countries != countries) && (cont.years != yearsName); //comprobar que el pais y el anyo de la peticion coindice mediante filtrado
        });
        res.sendStatus(200, "OK"); // devolver codigo de ok 
    });
    
    app.put(BASE_API_URL + OWN_API_URL, (req,res)=>{ //borrar todos los recursos
        res.sendStatus(400, "Bad Request"); // devolver codigo de ok 
    });
    
    // Actualización recurso concreto
    app.put(BASE_API_URL+OWN_API_URL+"/:countries/:years",(req,res)=>{
        if(req.body.countries == null |
            req.body.years == null | 
            req.body.most_grand_slam == null | 
            req.body.masters_finals == null | 
            req.body.olympic_gold_medals == null){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var countries = req.params.countries;
            var years = req.params.years;
            var body = req.body;
            var index = tennis.findIndex((reg) =>{
                return (reg.countries == countries && reg.years == years)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(countries != body.countries || years != body.years){
                res.sendStatus(400,"BAD REQUEST");
            }else{
                var  update_landusage = {...body};
                tennis[index] = update_landusage;
    
                res.sendStatus(200,"UPDATED");
            }
        }
    
    });
    
    //POST CONJUNTO
    app.post(BASE_API_URL + OWN_API_URL, (req,res)=>{
        var newData = req.body;
        var years = req.body.years;
        var countries = req.body.countries;
    
        if(!newData.years ||
            !newData.countries ||
            !newData.most_grand_slam||
            !newData.masters_finals||
            !newData.olympic_gold_medals){
                res.sendStatus(400,"Bad Request");
            }
        else{
            for(let i = 0;i<stats.length;i++){
                let elem = stats[i];
                if(elem.years === years && elem.countries === countries){
                    res.sendStatus(409,"Conflict");
                }
            }
            stats.push(req.body); // anyade lo que le pasemos en el cuerpo de la peticion
            res.sendStatus(201, "CREATED"); // devuelve codigo correcto
        }
    
        
    });
*/