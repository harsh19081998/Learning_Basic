const express = require("express");
const App = express();
const env = require("dotenv");
const cors= require("cors");
env.config();

const dbService = require("./DB")

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({extended:false}))

App.post('/create', (request, response) => {
    const { name,chapterNo } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewName(name,chapterNo);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

App.get("/list",(request,response)=>{
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

App.patch('/update', (request, response) => {
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

App.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

App.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

port = process.env.PORT
App.listen(port,()=>{
    console.log("App is running on https://localhost:"+port);
})