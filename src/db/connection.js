const mongoose=require("mongoose")
const blockchain=mongoose.connect("mongodb://localhost:27017/blockchain").then(function(){
    console.log("Connection Successful!");
}).catch(function(e){
    console.log("connection unsuccessful!");
})
