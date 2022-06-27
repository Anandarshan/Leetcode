const mongoose=require("mongoose");
var schema=mongoose.Schema;
const bld_grp=mongoose.model('patient_logins',new schema({FirstName:String,MiddleName:String,LastName:String,credential:String,hash:String}))
module.exports=bld_grp;