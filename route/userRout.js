var express = require('express');
var admin = require('../app/controller/userCtrl');
var router = express.Router();
router.post('/registration', admin.registration);
router.post('/OtpVerify',admin.OtpVerify);
router.post('/login',admin.login);
router.post('/forgotPassword',admin.forgotPassword);
router.post('/storeTransactionById',admin.storeTransactionById);
router.post('/getDataKey',admin.getDataKey);
module.exports = router;
