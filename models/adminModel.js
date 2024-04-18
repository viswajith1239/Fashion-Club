const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
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
    
    isadmin:{
        type:Number,
        required:true
    },

    isActive:{
        type:Boolean,
        required:true
    }
})
const admin=mongoose.model('admin',adminSchema)
module.exports=admin