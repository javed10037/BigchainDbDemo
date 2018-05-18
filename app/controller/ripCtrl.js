var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = require('../model/userModel.js');
var fs = require('fs');
var multer  =   require('multer');
var path = require('path');
var BigNumber = require('bignumber.js');
const accountSid = 'AC26b80d4aaacc7a0c2a40319852e5663d';
const authToken  = '70b8210cf5034211e1806ad2744932e1';
const client = require('twilio')(accountSid, authToken);
var cloudinary = require('cloudinary');
cloudinary.config({
        cloud_name: 'dodscctjl',
        api_key: '257456973794835',
        api_secret: 'CGbZoafaKNXVctWAgH-CoiGmJOY'
    });


var getAllInfoById = (req,res)=>{
       let userid = req.body.userid;
         User.findOne({_id : req.body.userid},{}).then((data)=>{
           res.json({message : "There are all data here of particular user",status :200,data : data})
         }).catch((err)=>{
           res.json({message : "Please enter the correct _id",status : 400})
         })
       }
var image_upload = (req, res)=>{
      var imageRes = "Image uploaded successfully"
      var img_base64 = req.body.image;
      binaryData = new Buffer(img_base64, 'base64');
      fs.writeFile("test.jpeg", binaryData, "binary", function(err) {
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhh');
          if (err) {
              console.log("errror in writtting file")
          } else {
                  cloudinary.uploader.upload("test.jpeg", function(result) {
                      if (result.url) {
                          res.json({
                              responseCode: 200,
                              responseMessage:"image upload successfully",
                              url: result.url
                          });
                      }
                  })
          }
      });
  }

  var resetPasswordByOTP = (req, res)=>{
  var newPassword        = req.body.newPassword;
  var confirmNewPassword = req.body.confirmNewPassword;
  var OTP = req.body.OTP;
  if (newPassword && confirmNewPassword && OTP) {
      User.findOne({ OTP }, {}).then((data)=>{
                      if (newPassword === confirmNewPassword) {
                          bcrypt.hash(confirmNewPassword, 10,(err, hash)=>{
                              if (err) {
                                  res.json({  message: "error to bcrypt newPassword",status: 400
                                  })
                              }
                              if (hash) {
                                  console.log("thereeeeeeeeeeeeeeee", data.Password);
                                  User.findOneAndUpdate({ OTP: OTP},{"$set": {"Password": hash}}).then((record)=>{
                                      console.log("hashhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh new pass", hash);
                                          res.json({  message: "Password Changed Successfully",status: 200 })
                                  }).catch((err)=>{
                                      res.json({  message: "new password unable to bcrypt the password",status: 400  })
                                  })
                            } else {
                                  res.json({message: "error to hash  the Passsword",status: 400
                                  })
                              }
                          }).catch((err)=>{
                          res.json({message: "error to hash  the Passsword",  status: 400})
                      })
                  } else {
                      res.json({  message: "newPassword && confirmNewPassword are not matched",status: 400  })
                  }
                }).catch((err)=>{
                  res.json({message : "Please enter the correct  OTP",status : 400})

              })
            }else{
              res.json({message : "Please enter the all required fields",status : 400})
            }

          }


    var changePasswordByUserId = (req, res) => {
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    var _id = req.body.userid;

    if (currentPassword && newPassword && confirmNewPassword && _id) {
        if (newPassword === confirmNewPassword) {
            User.findOne({
                _id
            }, {}).then((data) => {
                bcrypt.compare(currentPassword, data.Password).then((result) => {
                    if (result == true) {
                        bcrypt.hash(confirmNewPassword, 10).then((hash) => {

                            User.findOneAndUpdate({
                                _id: _id
                            }, {
                                "$set": {
                                    "Password": hash
                                }
                            }).then((rcd) => {
                                res.json({
                                    message: "Password Changed Successfully",
                                    status: 200
                                })
                            }).catch((err) => {
                                res.json({
                                    message: "Please enter the valid id",
                                    status: 400
                                })
                            })
                        }).catch((err) => {
                            res.json({
                                message: "err to hash the password",
                                status: 400
                            })
                        })
                    } else {
                        res.json({
                            message: "Please enter the correct current password",
                            status: 400
                        })
                    }
                }).catch((err) => {
                    res.json({
                        message: "error to compare the password",
                        status: 400
                    })
                })

            }).catch((err) => {
                res.json({
                    message: "Please enter the valid id",
                    status: 400
                })
            })

        } else {
            res.json({
                message: "password and confirm password not matched",
                status: 400
            })
        }
    } else {
        res.json({
            message: "Please enter the all required inputs",
            status: 400
        })
    }
}
deleteUserBYUserID  = (req,res)=>{
  var _id = req.body.userid;
  User.findOne({_id },{}).then((data)=>{
      if(data.IsDelete == true){
        res.json({message : "user already delete from db",status : 400})
      }else{
        User.updateOne({_id },{$set : {"IsDelete" : true}}).then((result)=>{
          res.json({message : "user deleted successfully",status : 200})
    }).catch((unsuccess)=>{
      res.json({message : "Please enter the valid id",status : 400})
    })
  }
}).catch((err)=>{
    res.json({message : "please enter the correct userid",status : 400})
  })
}


  exports.getAllInfoById  = getAllInfoById;
  exports.image_upload = image_upload;
  exports.resetPasswordByOTP = resetPasswordByOTP;
  exports.changePasswordByUserId = changePasswordByUserId;
  exports.deleteUserBYUserID = deleteUserBYUserID;
