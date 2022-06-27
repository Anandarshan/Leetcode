const sha256=require("sha256");
function genesisblock(){
    this.hash="";
    this.chain=[];
}
genesisblock.prototype.create_genesis=function(nonce,first_name,middle_name,last_name,occupation,phone_number,email,gender){
    const data=first_name+middle_name+last_name+occupation+phone_number.toString()+email+gender;
    const data_block=nonce.toString()+data;
    const hash=sha256(data_block);
    const genesis_block={
        timestamp:Date.now(),
        BLOCK_NAME:"GENESIS",
        FirstName:first_name,
        MiddleName:middle_name,
        LastName:last_name,
        Tel:phone_number,
        Occupation:occupation,
        email:email,
        Gender:gender,
        hash:hash
    }
    this.chain.push(genesis_block);
    this.hash=hash;
    return(genesis_block);
}
genesisblock.prototype.get_hash=function(){
    return(this.hash);
}
module.exports=genesisblock;