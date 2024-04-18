const mongoose=require("mongoose")

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    islisted:{
        type:Boolean,
        default:true
    },

    description:{
        type:String,
        required:true
    }
})

const category=mongoose.model('Category',categorySchema)

module.exports=category