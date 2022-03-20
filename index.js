const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");

const app = express();

const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19586040/UVsPQkGD";

app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const BASE_API_URL = "/api/v1"; 

var contacts = [
    {
        name:"peter",
        phone:123456
    },
    {
        name:"paul",
        phone:56789
    }
];


app.get(BASE_API_URL+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
});

app.get(BASE_API_URL+"/contacts",(req,res)=>{
    res.send(JSON.stringify(contacts,null,2));
});

app.get(BASE_API_URL+"/contacts/:name",(req,res)=>{
    
    var contactName = req.params.name;
    filteredContacts = contacts.filter((contact)=>{
        return (contact.name == contactName);
    });

    if(filteredContacts == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredContacts[0],null,2));
    }
});

app.post(BASE_API_URL+"/contacts",(req,res)=>{
    contacts.push(req.body);
    res.sendStatus(201,"Created");
});

app.delete(BASE_API_URL+"/contacts",(req,res)=>{
    contacts = [];
    res.sendStatus(200,"Ok");
});

app.delete(BASE_API_URL+"/contacts/:name",(req,res)=>{
    var contactName = req.params.name;
    contacts = contacts.filter((contact)=>{
        return (contact.name != contactName);
    });
    res.sendStatus(200,"OK");
});

app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

