
 var mysql=require('mysql2');
 var connect=mysql.createConnection(
     {
         host:'localhost',
         user:'root',
         password:'Muthuram@123',
         database:'workout',
         port:'3306'
     });
 module.exports=connect;
