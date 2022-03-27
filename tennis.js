module.exports.register = (app) => {
    const BASE_API_URL = "/api/v1";
    const OWN_API_URL = "/tennis";
    const path = require("path");
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    
    var tennis = [];
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
    app.get(BASE_API_URL + OWN_API_URL+"/:country", (req,res)=>{
        var country = req.params.country; // guarda el pais de la peticion
        filteredCountry = tennis.filter((cont) =>{ // filtra por el pais 
        return (cont.country == country); 
        
        });
     
        if(filteredCountry == 0){ // si devuelve falso devuelve error de no encontrado
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredCountry, null,2)); // si devuelve true devuelve los que coinciden.
        }
        console.log(filteredCountry);
    });
    
    //GET ELEMENTO POR PAIS Y ANYO
    app.get(BASE_API_URL + OWN_API_URL+"/:country/:year", (req,res)=>{
        var country = req.params.country; // guarda el pais de la peticion
        var yearName = req.params.year; // guarda el anyo de la peticion
        filteredYear = tennis.filter((cont) =>{ 
        return (cont.country == country) && (cont.year == yearName); // filtra los que coinciden con el anyo y el pais de la peticion 
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
        var year = req.body.year;
        var country = req.body.country;
    
        for(let i = 0;i<tennis.length;i++){
            let elem = tennis[i];
            if(elem.year === year || elem.country === country){
                res.sendStatus(409,"Conflict");
            }
        }
        tennis.push(req.body); // anyade lo que le pasemos en el cuerpo de la peticion
        res.sendStatus(201, "CREATED"); // devuelve codigo correcto
    });
    
    //POST RECURSO ERROR
    app.post(BASE_API_URL + OWN_API_URL+ "/:country", (req,res)=>{
        res.sendStatus(405, "Method Not Allowed"); // devuelve codigo method not allowed
    });
    
    //DELETE CONJUNTO
    app.delete(BASE_API_URL + OWN_API_URL, (req,res)=>{ 
        tennis = []; // deja vacio el conjunto
        res.sendStatus(200, "OK"); // devuelve codigo correcto
    });
    
    //DELETE ELEMENTO POR PAIS
    app.delete(BASE_API_URL + OWN_API_URL+"/:country", (req,res)=>{ //borrar todos los recursos
        var country = req.params.country; // pais de la peticion 
        tennis = tennis.filter((cont) =>{ // filtrar pais que coindice con la peticion
            return (cont.country != country); 
        });
        res.send(JSON.stringify(tennis, null,2));
        res.sendStatus(200, "OK");
    });
    
    // DELETE ELEMENTO POR PAIS Y ANYO
    app.delete(BASE_API_URL + OWN_API_URL+"/:country/:year", (req,res)=>{ //borrar todos los recursos
        var country = req.params.country; //pais de la peticion
        var yearName = req.params.year; //anyo de la peticion
        tennis.filter((cont) =>{
            return (cont.country != country) && (cont.year != yearName); //comprobar que el pais y el anyo de la peticion coindice mediante filtrado
        });
        res.sendStatus(200, "OK"); // devolver codigo de ok 
    });
    
    app.put(BASE_API_URL + OWN_API_URL, (req,res)=>{ //borrar todos los recursos
        res.sendStatus(400, "Bad Request"); // devolver codigo de ok 
    });
    
    // Actualización recurso concreto
    app.put(BASE_API_URL+OWN_API_URL+"/:country/:year",(req,res)=>{
        if(req.body.country == null |
            req.body.year == null | 
            req.body.quantity == null | 
            req.body.absolute_change == null | 
            req.body.relative_change == null){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var country = req.params.country;
            var year = req.params.year;
            var body = req.body;
            var index = tennis.findIndex((reg) =>{
                return (reg.country == country && reg.year == year)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(country != body.country || year != body.year){
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
        var year = req.body.year;
        var country = req.body.country;
    
        if(!newData.year ||
            !newData.country ||
            !newData.built-area||
            !newData.grazing-area||
            !newData.cropland-area){
                res.sendStatus(400,"Bad Request");
            }
        else{
            for(let i = 0;i<tennis.length;i++){
                let elem = tennis[i];
                if(elem.year === year && elem.country === country){
                    res.sendStatus(409,"Conflict");
                }
            }
            tennis.push(req.body); // anyade lo que le pasemos en el cuerpo de la peticion
            res.sendStatus(201, "CREATED"); // devuelve codigo correcto
        }
    
        
    });
    
    }