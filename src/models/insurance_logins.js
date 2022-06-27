const mongoose=require("mongoose");
const schema=mongoose.Schema;
const insurance_login=mongoose.model("insurance_logins",new schema({InsuranceName:String,password:String}))
module.exports=insurance_login;