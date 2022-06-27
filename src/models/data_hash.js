const mongoose=require("mongoose");
const data_keys=new mongoose.Schema({
    data:{
        type:String,
        required:true
    },
    public_key:{
        type:Object,
        required:true
    },
    private_key:{
        type:Object,
        required:true
    },
    patient_name:{
        type:String,
    }
});
const model=mongoose.model("data_keys",data_keys);
module.exports=model;