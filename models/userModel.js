const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    address:[
        {
            housename:{
                type:String
            },
            streetname:{
                type:String
            },
            areaname:{
                type:String
            },
            districtname:{
                type:String
            },
            statename:{
                type:String
            },
            countryname:{
                type:String
            },
            pin:{
                type:Number
            }
        }
    ],
    
    isadmin:{
        type:Number,
        required:true
    },

    isActive:{
        type:Boolean,
        required:true
    },
    refferalCode: {
        type: String,
        uppercase: true,
        unique: true,
        default: generateCouponCode,
    },
    wallet: {
        balance: { type: Number, default: 0 },
        details: [
          {
            type: { type: String, enum: ["credit", "debit", "refund"] },
            amount: { type: Number },
            date: { type: Date },
            transactionId: {
              type: Number,
              default: function () {
                return Math.floor(100000 + Math.random() * 900000);
              },
            },
          },
        ],
      },
})


function generateCouponCode() {
    const length = 8;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let couponCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      couponCode += characters.charAt(randomIndex);
    }
    return couponCode;
  }
  
const User=mongoose.model('User',userSchema)
module.exports=User