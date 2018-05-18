var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminrcd = new Schema({
            FirstName :               { type : String, required : true},
            LastName  :               { type : String },
            Phone     :               { type : Number },
            Image     :               { type : String, default : '' },
            Password  :               { type : String  },
            Email     :               { type : String },

            resetPasswordToken  : { type: String},
            resetPasswordExpires: { type: Date},
            AccountType :             { type : String ,
                                            enum : ['Admin','Client'],
                                                    default : 'Admin' },
           OtpVerify         :       { verificationStatus: {type: Boolean, default :false}
                                  },



            CreatedAt :               { type  : Date ,default : Date.now },
            OTP        :               { type : String },
            OTPExpire  :                {type : Date },
            IsDelete   :                { type : Boolean , default : false },
            PublicKey  :               {type : String},
            PrivateKey :               {type : String},
            Orders : [{
            Tx      :       {type : String},
            date    :       {type :String ,default: new Date().getTime()}

             }]



   });

module.exports = mongoose.model('user',adminrcd);
