const mongoose=require("mongoose");
const schema=mongoose.Schema;
const patient_details=mongoose.model("patient_details",new schema({patientName:String,patientID:String,Insurance:String,ReferenceName:String,referenceMail:String,email_password:String}))
module.exports=patient_details;