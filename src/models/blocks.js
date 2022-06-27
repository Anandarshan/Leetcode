const mongoose=require("mongoose");
const schema= mongoose.Schema;
const model=mongoose.model("blocks",new schema({index:String,nonce:String,timestamp:String,data:String,prevhash:String,hash:String,publickey:String}))
module.exports=model;