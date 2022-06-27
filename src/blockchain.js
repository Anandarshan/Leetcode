const sha256=require("sha256");
function blockchain(){
    this.chain=[]
    this.pending_data=[]
    this.createNewBlock(111,"1111242bbabcbB6Cd5c2YaC2B2dc1544dC8813Z1ZA8bYac89a38BBc726Z264Y3","1111B6B7bZZdaYaZ84d66C3B7a713bcab72C6Ab6a7daC1d27Z5ab91773dBAAdc")
}
blockchain.prototype.createNewBlock=function(nonce,prevhash,hash){
    const new_block={
        index:this.chain.length+1,
        nonce:nonce,
        timestamp:Date(Date.now()).toString(),
        data:this.pending_data,
        prevhash:prevhash,
        hash:hash,
        
    }
    this.pending_data=[]
    this.chain.push(new_block);
    return(new_block);
}
blockchain.prototype.hashvalue=function(nonce,data,prevhash){
    const String=nonce.toString()+data+prevhash;
    hashvalue=sha256(String);
    return(hashvalue);
}
blockchain.prototype.getLastBlock=function(){
    return(this.chain[this.chain.length-1]);
}

blockchain.prototype.createNewData=function(data){
    this.pending_data.push(data);
    return(this.getLastBlock()['index']+1);
}
blockchain.prototype.pow=function(prevhash,data){
    var nonce=0;
    var hash=this.hashvalue(nonce,data,prevhash);
    while(hash.substring(0,4)!=='1111'){
        nonce+=1;
        hash=this.hashvalue(nonce,data,prevhash);
    }
    return(nonce);
}



module.exports=blockchain;