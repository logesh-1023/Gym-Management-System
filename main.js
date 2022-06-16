var express=require('express');
var app=express();
var route=require('./route/route.js')
app.use(route);
 app.set('view engine','ejs')
 app.set('view','views')
app.listen(8020)
   console.log("server is running at 8020");
