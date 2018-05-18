var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose  = require('mongoose');
var cors = require('cors');
var bcrypt = require('bcrypt');
var rip  = require('./route/ripRout');
var jwt = require('jsonwebtoken');
var User = require('./app/model/userModel')
app.use(bodyparser({limit: '50mb'}))
app.use(bodyparser.urlencoded({limit: '50mb'}));
app.use(bodyparser());

app.use(bodyparser.json());
//mongodb.connect('mongodb://javed0037:javed123@ds123619.mlab.com:23619/advocate_case_dairy');
mongoose.connect('mongodb://localhost/MobileAppBigchain');
var USER =require('./route/userRout');
app.use('/user',USER);
app.use(cors());
app.use('/rip/*', function(req, res, next){
    console.log('****/rip route required UserId in all apis uses MIDDLEWARE****');
      var token =  req.headers["authorization"];
    if (token) {
      try {
        token = token.split(' ')[1];

        var decoded = jwt.verify(token,'secret',function (err,decoded){

          if(err){

            return res.json({status :400, message: 'Authorization token is not valid',error : err});
          }else {
            console.log(decoded,"decoded token")
            req.user = decoded;
            next();
          }
        });
      } catch (e) {
        return res.send({status:400, message: 'Authorization token is not valid'});
      }
    } else {
      console.log("No token");
      return res.send({status:400,message: 'Authorization token missing in request.'});
   }
})

app.use('/rip', rip);
app.listen(9090,function(req,res){
  console.log("port 9090 is Running......................... ");
})
module.exports = app;
