

const mongoose =require('mongoose')

const productSchema=new  mongoose.Schema({

    name:{
    type:String,
    required:true
    },

    description:{
        type:String,
        required:true
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    productprice:{
        type:Number,
        required:true
    },

    productQuantity:[
        {
        size:{
            type:String,
            enum:["S","M","L"],
        },
        quantity:{
            type:Number,
            default:0,
        },
    }
    ],

    productDiscount:{
        type:Number,
        default:0
    },

    discountExpiry:{
        type:Date,
    },
    image:[
        {
            type:String,
            required:true
        }
    ],

    productstatus:{
        type:Boolean,
        default:true,

    },

    totalQuantity:{
        type:Number,
    },






})

const product=mongoose.model('Product',productSchema)

module.exports=product