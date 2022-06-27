const mongoose=require("mongoose");
const schema=mongoose.Schema;
const doctor_info=mongoose.model("doctor_informations",new schema({_id:String,Name:String,Specialization:String,publickey:String,patient:Object,studied:String,experience:String}));
module.exports=doctor_info;

