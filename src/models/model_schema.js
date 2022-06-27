const mongoose=require("mongoose");
const login=new mongoose.Schema({
    FirstName:{
        required:true,
        type:String
    },
    MiddleName:{
        type:String
    },
    LastName:{
        required:true,
        type:String
    },
    credential:{
        type:String,
        required:true

    },
    hash:{
        type:String,
        required:true
    }

})
const model_schema=new mongoose.model("Patient_logins",login);
module.exports=model_schema;

