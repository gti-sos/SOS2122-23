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
    
    }