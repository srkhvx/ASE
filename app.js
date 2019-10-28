const express = require('express');
const jwt = require('jsonwebtoken');

const app=express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '\\new_html.html'));
});


app.get('/api', (req, res)=>{
    res.json({
        message:'Welcome to the API'
    });
});

app.post('/api/posts/', verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretkey', (err,authData)=>{
       if(err){
           res.sendStatus(403);
       }
       else{
           res.json(
               //message: 'post Created...',
               "ID: "+authData["user"]["id"] +" NAME: "+authData["user"]["name"]+ " EMAIL "+authData["user"]["email"]
           )
       }
    });

});

app.post('/api/login', (req,res)=>{
    const user={
        id: 1,
        name:'Shah Rukh Khan',
        email:'khanshah644@gmail.com'
    };
    jwt.sign({user}, 'secretkey',(err, token)=>{
        res.json({token})
    });

});
//Format of the token
//Authorizations: Bearer <access_token>

//Verify token
function verifyToken(req,res,next){
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    var fs = require("fs");
    var content = fs.readFileSync("response.json")
    if(1==1){

        var jsonContent = JSON.parse(content);
        req.token = jsonContent.token
        console.log("Output Token : \n"+ jsonContent.token);
        console.log("\n *EXIT* \n");
        next();

    }else{
        res.sendStatus(403);
    }
}

app.listen(3000, ()=>{
    console.log("Sever started on 3000")
});
