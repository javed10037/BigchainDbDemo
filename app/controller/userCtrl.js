var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = require('../model/userModel.js');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
           const accountSid = 'AC26b80d4aaacc7a0c2a40319852e5663d';
           const authToken  = '70b8210cf5034211e1806ad2744932e1';
const client = require('twilio')(accountSid, authToken);
const Request = require('request');
const driver = require('bigchaindb-driver')
// BigchainDB server instance or testnetwork (e.g. https://test.bigchaindb.com/api/v1/)
const API_PATH = 'http://localhost:9984/api/v1/'
let conn = new driver.Connection('https://test2.bigchaindb.com/api/v1/', {
  app_id: 'd2f9ea59',
  app_key: '325e0871a6f63144b3fb67f2b3fe81bf'
})
var registration = (req, res)=>{
      let Password = req.body.Password;
      let confirmpassword =  req.body.confirmpassword;
      var token;
      if(confirmpassword == Password) {
            User.findOne({Email:req.body.Email},{}).then((data)=>{
               if(!data){
                       bcrypt.hash(Password, 10, (err, hash)=> {
                         if (err) {
                          return  res.json({ message: "unable to bcrypt the password",status: 200 })
                           } else if (hash){
                              let requestObj = {
                                  FirstName: req.body.FirstName,
                                  LasName: req.body.LastName,
                                  Phone: req.body.Phone,
                                  Email : req.body.Email,
                                  Password: hash,

                                  };

                                  if(requestObj.FirstName && requestObj.LasName && requestObj.Phone && requestObj.Email){
                                    User.create(requestObj).then((success)=>{
                                           console.log('register successfully');
                                            res.json({meassage :"New Account has been register successfully",data:success,status : 200})
                                            // let OTP = Math.floor((Math.random() * 100000) + 1);
                                            // success.OTP = OTP;
                                            // success.OTPExpire = Date.now() + 3600000000;
                                  //           success.save(function(err,result){
                                  //             if(err){ return res.json({message : "error due to db error",status  :400})
                                  //           }
                                  //           else if(result){
                                  //          client.messages.create(
                                  //           {
                                  //            to: '+91'+requestObj.Phone,
                                  //            from: '+12568297885',
                                  //            body: 'Hi YOur OTP is'+ OTP
                                  //          },
                                  //           (err, message) => {
                                  //           if(err)  res.json({ message : "Unable to  send", error : err});
                                  //           if(message){
                                  //             console.log('your account has been register and otp send sucessfully on you mob no');
                                  //          }
                                  //        }
                                  //      )
                                  //   }else{ return res.json({message : "please enter valid inputs"})}
                                  // })
                                }).catch((unsuccess)=>{
                              return  res.json({ message: "Please enter the correct inputs", status: 400 })

                          })
                        }
                          else { return res.json({ message : "Please enter the all required field ",meaasge : 400 })
                        }

                    }
                     else {
                      return  res.json({  message: "Password is unable to bcrypt" , status: 400 })
                    }
                })
              }

              else {
              return  res.json({messagge : "This email id is already register with us",status : 400})}
             }).catch((err)=>{
          return  res.json({ message: "Please enter the correct email id " });
        })
    }else {
    return  res.json({ message: "Password and confirmPassword not match " });
    }
  }
  var OtpVerify = (req,res)=>{
    var Email = req.body.userId;
    var OTP = req.body.otp;
    User.findOne({Email: req.body.userId},{}).then((data)=>{
                if(data.OTP == OTP){
                if (data.OtpVerify.verificationStatus === true){ // already verified
                  console.log("account verified");
                  return  res.json({status : 400,message: "Your Phone number is  already verified."});
                }else { // to be verified
                  const alice = new driver.Ed25519Keypair()
                  data.OtpVerify.verificationStatus = true;
                  data.PublicKey = alice.publicKey;
                  data.PrivateKey = alice.privateKey;
                    data.save((err,success)=>{
                      if(err){
                          return  res.json({message :"Please enter the valid keys",status : 400})
                        }else if(success){
                                        return  res.json({message : "Email verified successfully and User keys are  successfully saved ",data : data,status : 200})
                                      }else {
                                          return  res.json({message :"Please enter the valid keys",status : 400})
                                        }
                          })
                            //re//s.redirect(Constant.hostingServer.serverUiName);
               }
             }else {
               return res.json({message : "please enter the valid opt",status  : 400})
           }
                }).catch((err)=>{
                  console.log(err)
            return  res.json({message: "OTP is expired.",status : 400});
    })
  }
login = (req,res)=>{
               var reqObj = {
                  Email : req.body.userId,
                  Password : req.body.userPassword
               };
               if(reqObj.Email && reqObj.Password){
                 User.findOne({Email :req.body.userId}).then((data)=>{
                     // if(!data.IsDelete == true){
                     // if(data.OtpVerify.verificationStatus == true){
                     bcrypt.compare(reqObj.Password,data.Password,(err,success)=>{
                       if(err){
                         res.json({message : "unable to campare the password",status : 400})

                       } else if(success){
                            var token = jwt.sign({id:data._id},'secret',{ expiresIn: '1h' });
                            return res.json({ message : "User login successfully",auth : true,token : token , data : data })

                      var userid =  (req, res)=>{
                       var token = req.headers['token'];
                       jwt.verify(token, "name", (err, decoded)=>{
                         if (err) return res.json(err);
                         return res.json(decoded);
                       });
               }
                }else {
                  res.json({ message : "PLease enter the correct password ",})
                }
              })
            // }else{
            //   res.json({message :  "Your Phone is not verified ,First Please verify your Phone",status : 400})
            // }
          // }else {
          //    res.json({message :  "Your Account is not register with us first register and then login",status : 400})
          // }
          }).catch((err)=>{
             res.json({message : "Please enter the valid Email id ",status : 400})
             })
           }else {
           res.json({message : "Please enter the required username and password carefully",status : 400})
         }
       }
       var forgotPassword = (req,res)=>{
                 User.findOne({Phone : req.body.Phone},{}).then((data)=>{
                   if(!data.IsDelete == true){
                     let OTP = Math.floor((Math.random() * 100000) + 1);
                     data.OTP = OTP;
                     data.OTPExpire = Date.now() + 36000;
                           data.save(function (err, data){
                           if(err){
                             res.json({message : "Please enter the valid email Id",status : 400})
                           }else if(data){
                            res.json({message : "reset verification OTP has been send successfully on your Phone number",ststus : 200})
                           client.messages.create(
                            {
                             to: '+91'+data.Phone,
                             from: '+12568297885',
                             body: 'forgot password otp '+ OTP
                           },
                            (err, message) => {
                            if(err) res.json({ message : "Unable to  send", error : err});
                            if(message){
                              console.log('Forget password otp send sucessfully on you Phone no');
                           }
                         }
                       )
                    }else{
                      res.json({message : "Unable to generate the otp",status : 400})
                    }

                })
              }else{
              return res.json({message :  "Your Account is not register with us first and then try",status : 400})
              }

                   }).catch((err)=>{
                 res.json({message : "Please enter the valid Phone No",status : 400})
             })

           }
storeKeys = (req,res)=>{
    var _id = req.body.userid;
    var reqObj = {
      PublicKey : req.body.PublicKey,
      PrivateKey : req.body.PrivateKey
    };
    if(_id && reqOb.PublicKey && reqOb.PrivateKey ){
    User.findOneAndUpdate(_id,{$set : reqObj},{new : true}).then((data)=>{
      res.json({message :"error to get  value from db",status : 400})
    }).catch((err)=>{
      res.json({message :"Please enter the valid keys",status : 400})
    })
  }else {
        res.json({message :"Please enter the all required fields",status : 400})
      }
}
  storeTransactionById = (req,res)=>{
    var _id = req.body.userid;
   let  Tx = req.body.transactionId;
if(_id && Tx){
  User.update({_id : req.body.userid},{$push : {'Orders' :{"Tx" : req.body.transactionId}}}).then((data)=>{
     res.json({message : "User transactionId are  successfully saved ",status : 200})
   }) .catch((err) =>{
      res.json({message :"Please enter the valid keys",status : 400})
   })
 }else {
      res.json({message :"Plese enter the required fields",status : 400})
    }
  }
var getDataKey = (req,res) =>{
          var _id  = req.body.userid;
          if(_id){
          User.findOne({_id},{FirstName: 1,PublicKey : 1,PrivateKey : 1,Email : 1}).then((data)=>{
            return res.json({message : "user information received sucessfully",data : data,status : 200})
          })
          .catch((err)=>{
            return res.json({message : "Please enter the valid  id",status  : 400})
          })
        }else {
          return res.json({message : "Please  enter the id",status  : 400})
        }
     }
exports.registration = registration;
exports.OtpVerify = OtpVerify;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.storeKeys = storeKeys;
exports.storeTransactionById = storeTransactionById;
exports.getDataKey  = getDataKey;
