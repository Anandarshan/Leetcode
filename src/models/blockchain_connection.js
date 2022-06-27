const mongoose=require("mongoose");
const information=new mongoose.Schema({
   Name:{
       type:String
   },
   data:{
       type:String,
       required:true
   },
   publicKey:{
       type:Object
   }

})
const model_schema=new mongoose.model("blockchain_cred",information);
module.exports=model_schema;
