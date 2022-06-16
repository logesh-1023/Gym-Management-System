var express=require('express');
var route=express();
var connection=require('../model/db.js')
route.use(express.urlencoded({extended:false}));
var nodemailer=require('nodemailer');
route.use(express.static('public'));
var p;
var e;
var t;
route.get('/login',(req,res)=>
{
    res.render('login',{msg:""});
}
)
route.get('/signup',(req,res)=>
{
    res.render('SIGNUP');
}
)
route.get('/dashboardadmin',(req,res)=>
{
    res.render('dashboardadmin',{msg:t,r:p});
}
)
route.get('/contact',(req,res)=>
{
    res.render('contact',{msg:""});
}
)
route.get('/makeacall',(req,res)=>
{
    res.render('makeacall');
})
route.get('/dashboard',(req,res)=>
{
    res.render('dashboard',{msg:t,r:e});
})
route.get('/description',(req,res)=>
{
    connection.query("select * from workoutlist",(err,results)=>
    {
        if(err) throw (err)
        else
        {
            res.render('description',{r:results});
        }
    })
}
);
route.get('/addworkout',(req,res)=>
{
    res.render('addworkout',{r:""});
})
route.post('/send',function(req,res)
{
    var radio=req.body.week;
    var tex=req.body.instruct;
    connection.query("update plan set text=? where day=?",[tex,radio],(err,results)=>
{
    if(err) throw (err)
    else 
    {

        res.render('contact',{msg:"SHEDULE HAS BEEN SENT SUCCESSFULLY"});
    }
})
});
route.post('/submit',function(req,res)
{
  var fn=req.body.FIRST;
  var ln=req.body.LAST;
  var email=req.body.email;
  var ad=req.body.address;
  var age=req.body.age;
  var password=req.body.password;
  
  var transporter=nodemailer.createTransport({
      service:'gmail',
      auth:
      {
          user:'logeshcosta@gmail.com',
          pass:'muthuram123@'
      }
});
var mailOptions={
    from:'logeshcosta@gmail.com',
    to:email,
    subject:'Welcome your account has Been created',
    text:'Thank you',
};
transporter.sendMail(mailOptions,function(error,info)
{
    if(error)
    {
        console.log(error);
    }
    else
    {
      console.log('Email sent:'+info.response);
    }
});
connection.query("insert into user values((?),(?),(?),(?),(?),(?))",[fn,ln,email,ad,age,password],(err,results)=>
{
    if(err) throw (err)
    else
    {
        console.log(results);
        res.render('login',{msg:"Your Profile is inserted successfully"});
    }
})
});
route.post('/validatesign',(req,res)=>
 {
     var email=req.body.EMAIL;
     var pa=req.body.PASS;
     connection.query("select email from user where email=(?)",[email],(err,results)=>
     {
         if(err) throw (err)
         else if(results.length>0)
         {
             connection.query("select * from user where email=(?) and password=(?)",[email,pa],(err,results1)=>
             {
                 if(err)throw(err)
                 else if(results1.length>0)
                 {
                     connection.query("select * from user where email=(?) and password=(?)",[email,pa],(err,results2)=>
                     {
                        t=results2[0].firstname;
                        if(t=='admin')
                        {
                          connection.query("select * from user where email not like 'Admin%' or 'admin%'",[email],(err,result3)=>
                          {
                              if(err) throw(err)
                              else 
                              {
                                  p=result3;
                                res.render('dashboardadmin',{r:result3});
                              }
                          })
                        }
                        if(t!='admin')
                         {
                            connection.query("select * from plan",(err,result4)=>
                            {
                                if(err) throw(err)
                                else 
                                {
                                  e=result4;
                                  res.render('dashboard',{r:e});
                                }
                            })
                         }
                     })
                 }
                 else
                 {
                     res.render('login',{msg:"wrong email and password"});
                 }
             })
         }
         else
         {
            res.render('login',{msg:"wrong email"});
         }
     })
 })
 route.get('/workoutshedule',(req,res)=>
 {
     var mus=req.body.Muscle;
     var workout=req.body.Workout;
     var sets=req.body.sets;
     var time=req.body.rest_time_in_sec;
     connection.query("select * from workoutlist",[mus,workout,sets,time],(err,results)=>
     {
         if(err) throw (err)
         else
         {
             res.render('workoutshedule',{r:results});
         }
     })
     });
route.post('/update',(req,res)=>
 {
     var mus=req.body.workout;
     var workout=req.body.wname;
     var sets=req.body.sets;
     var time=req.body.rest;
     var des=req.body.description;
     connection.query("insert into workoutlist values((?),(?),(?),(?),(?))",[mus,workout,sets,time,des],(err,results)=>
     {
         if(err) throw (err)
         else
         {  
             res.render('addworkout',{r:results});
         }
     })
     });
module.exports=route;
