const mongoose=require("mongoose");
const schema=mongoose.Schema;
const doctor_login=mongoose.model("doctor_logins",new schema({_id:String,doctorName:String,password:String}));
module.exports=doctor_login;