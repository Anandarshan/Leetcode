const express = require("express")
const mongoose = require("mongoose")
const path=require("path")
const hbs=require("hbs")
const fs=require("fs");
const crypto = require("crypto");
require("../src/db/connection");
const insurance_login=require("../src/models/insurance_logins");
const patient_details=require("../src/models/patient_details");
const block_chain=require("./blockchain");
const blockchain=new block_chain();
const login_cred=require("./models/grp");
const nodemailer=require("nodemailer")
var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'anandarshan.laurel@gmail.com',
        pass:'dajunwvxenuzncku'
    }
});

const app=express()
app.set("view engine","hbs");
hbs.registerPartials(path.join(__dirname,"../src/partials"));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get("/update",function(req,res){
    res.render("update");
})
app.get("/login",function(req,res){
    res.status(201).render("login");
})
const genesis_class=require("./genesisblock");
const genesis=new genesis_class();
name_of="";
app.post("/genesis",async(req,res)=>{
    const first_name=req.body.FirstName;
    const middle_name=req.body.MiddleName;
    const last_name=req.body.LastName;
    const gender_selection=req.body.gender;
    const occupation=req.body.occupation;
    const phone_number=req.body.phoneno;
    const email=req.body.email;
    const password=req.body.password;
    console.log(first_name);    
    console.log(middle_name);
    console.log(last_name);
    console.log(gender_selection);
    //blockchain.createNewBlock(1234,1234567);
    genesis.create_genesis(1234,first_name,middle_name,last_name,occupation,phone_number,email,gender_selection);
    console.log(email);
    console.log(genesis);
    console.log(blockchain);
    const credentials=email+" "+password;
    const patient_info=new login_cred({
        
        FirstName:first_name,
        MiddleName:middle_name,
        LastName:last_name,
        credential:credentials,
        hash:genesis.get_hash()
    })
    await patient_info.save();
    console.log(genesis.get_hash());
    res.status(201).render("genesis",{FN:first_name});
    
})

const doctor_info=require("./models/doctor_info");
app.post("/patient_login",async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const check_cred=email+" "+password;
    console.log(check_cred)
    
    login_cred.find({}).lean().exec(function(error,records){
        true_=0
        records.forEach(function(data){
            if(check_cred===data.credential){
                const PatientName=data.FirstName+data.MiddleName+data.LastName;
                true_=1;
                found(true_,PatientName);
            }
            else{
                true_=0;
            }
        })
        
    })
    function found(true_,PatientName){
        if(true_===1){
            doctor_info.find({},function(err,data){
                console.log(data);
                res.status(201).render("complete_patient",{data:data,PatientName:PatientName});
            })
            return 0;
        }
        else{
            res.render("patient_login",{data:"Wrong Login and password!"});
            return 0;
        }
    }
    return 0;
    

})
const MongoClient=require("mongodb").MongoClient;
var url="mongodb://localhost:27017/blockchain";
app.post("/complete_patient",async(req,res)=>{
    const doctor_name=req.body.Grant_access;
    const patient_name=req.body.patname;
    
    console.log(doctor_name);
    console.log(patient_name);
    const patient=patient_name;
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        db.collection('doctor_informations').updateOne({Name:doctor_name},{$push:{patient}},function(err,result){
            if(err) throw err;
            else{
                console.log("done!");
                res.send("Access Sent")
            }
        });
    })
    
})
const doctor_login=require("./models/doctor_login");
app.post("/doctor_login",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    doctor_login.find({}).lean().exec(function(err,record){
        found=0;
        record.forEach(function(data){
            if(username===data.doctorName && password===data.password){
                found=1;
                newfound(found,username);
                console.log("matched");
                return 0;
            }
            else{
                found=0;
            }
        })
    })
    function newfound(found,username){
        if(found===1){
            doctor_info.find({}).lean().exec(function(err,record){
                record.forEach(function(data){
                    if(data.Name===username){

                        res.status(201).render("patient_list",{data:data.patient,name:data.patient,doctor_name:data.Name}); 
                    }
                })
            })
            
            return 0;
        }
        else{
            res.send("Not Found!");
            return 0;
        }
    }
})
app.get("/patient_list",function(req,res){
    res.status(201).render("patient_list");
})
app.post("/form_creation",async(req,res)=>{
    const doctor_name=req.body.doctor_name;
    console.log(doctor_name);
    console.log("here")
    doctor_info.find({}).lean().exec(function(err,record){
        
        record.forEach(function(data){
            if(data.Name===doctor_name){
                res.render("form_creation",{patient_name:data.patient});       
            }
        })
    })
})
const data_key=require("./models/data_hash");
const blocks=require("./models/blocks");

app.post("/encrypt",async(req,res)=>{
    const first_con=req.body.condition;
    const sec_con=req.body.condition5;
    const patient_name=req.body.name_patient;
    const bp_level=req.body.purpose;
    const sugar_level=req.body.sugar_level;
    const prescription=req.body.prescription;
    console.log(patient_name);
    console.log(first_con);
    console.log(sec_con);
    const data=first_con+"\n"+sec_con+"\n"+patient_name+"\nSugarLevel"+sugar_level+"\nbp_level"+bp_level+"\nPrescription"+prescription;
    console.log(data);
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
      
        modulusLength: 2048,
    });
    console.log(publicKey.toString('base64'));

    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
  
        Buffer.from(data)
    );
    const PublicKeyBuffer = publicKey.export({ type: 'pkcs1', format: 'pem' })
    console.log();
    console.log(PublicKeyBuffer);
    console.log();
    const PrivateKeyBuffer = privateKey.export({ type: 'pkcs1', format: 'pem' })
    console.log();
    console.log(PrivateKeyBuffer);
    console.log();
    
    console.log("encypted data: ", encryptedData.toString("base64"));
    console.log(privateKey);
    const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        encryptedData
      );
      
      const saving_data=new data_key({
          data:encryptedData.toString("base64"),
          public_key:PublicKeyBuffer,
          private_key:PrivateKeyBuffer,
          patient_name:patient_name
      })
      await saving_data.save();
      console.log("decrypted data: ", decryptedData.toString());
      const prev_hash=blockchain.getLastBlock()['hash']
      blockchain.createNewData(encryptedData.toString("base64"));
      const nonce=blockchain.pow(prev_hash,encryptedData.toString("base64"));
      const next_hash=blockchain.hashvalue(nonce,encryptedData.toString("base64"),prev_hash);
      blockchain.createNewBlock(nonce,prev_hash,next_hash);
      console.log(blockchain);
      login_cred.find({}).lean().exec(function(err,record){
          record.forEach(function(data){
              const patientName=data.FirstName+data.MiddleName+data.LastName;
              if(patientName===patient_name){
                  send_email(data.credential);
              }
          })
      })
      function send_email(credential){
          var email=credential.split(" ") 
          var mailOptions={
              from:'anandarshan.laurel@gmail.com',
              to:email[0],
              subject:'Access your medical record',
              text:next_hash+" login into patient module and paste the block with your private key  "+PrivateKeyBuffer+" paste this to decrypt your file"
          };
          transporter.sendMail(mailOptions,function(err,info){
              if(err){
                  console.log(err);
              }
              else{
                  console.log('Email sent: '+info.response);
              }
          });   

      }
      const save_block=new blocks({
        index:blockchain.getLastBlock()['index'],
        nonce:nonce,
        timestamp:Date(Date.now().toString()),
        data:encryptedData.toString("base64"),
        prevhash:prev_hash,
        hash:next_hash,
        publickey:PublicKeyBuffer
      })
      save_block.save();





      res.send("Block Sent Successfully");
    
})
app.post("/block_data",function(req,res){
    data_key.find(function(err,result){
        res.render("block_info",{block:result});
    })

})
app.post("/decrypt",function(req,res){
    const hash=req.body.hash;
    private=req.body.private;
    blocks.find({}).lean().exec(function(err,records){
        records.forEach(function(result){
            
            if(result.hash===hash){
                console.log("found hash values")
                get_details(result.data,result.publickey)
            }
        })

    })
    z=0
    function get_details(data,key){
       const encrypted_data=Buffer.from(data,'base64')
       console.log(private);
       
       const decryptedData = crypto.privateDecrypt(
        {
          key: private,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        encrypted_data
        );
        console.log(decryptedData.toString("utf-8"));
        res.status(201).render("block_info",{block_data:decryptedData.toString("utf-8")})
        return 0;
    }




})
app.post("/Insurance_LOGIN",async(req,res)=>{
    const insurance_name=req.body.email;
    const password=req.body.password;
    insurance_login.find({}).lean().exec(function(err,result){
        found=0;
        result.forEach(function(data){
            if(data.InsuranceName===insurance_name && data.password===password){
                found=1;
                login(found);
            }
            else{
                found=0;
            }
        })
    })
    function login(found){
        if(found===1){
            res.send("login successful!");
        }
        else{
            res.send("Wrong details")
        }
    }

})
num_result = Math.floor(1000 + Math.random() * 9000)
app.post("/reference_login",async(req,res)=>{
    const ref_name=req.body.Reference_name;
    const pat_name=req.body.patient_name;
    const ref_mail=req.body.Reference_mail;
    patient_details.find({}).lean().exec(function(err,result){
        found=0;
        result.forEach(function(data){
            if(ref_name===data.ReferenceName && pat_name===data.patientName && ref_mail===data.referenceMail){
                found=1;
                verify(found,ref_mail,pat_name);
                
            }
        })
        
    })
    function verify(found,ref_mail,pat_name){
        try{
        if(found===1){
            var mailOptions={
                from:'anandarshan.laurel@gmail.com',
                to:"anankrisuni@gmail.com",
                subject:'Access your medical record',
                text:"the OTP generated random number is "+num_result
            };
            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Email sent: '+info.response);
                }
            });
            res.status(201).render("refp_2",{actual_output:num_result,pat_name:pat_name});
        }
        }
        catch{
            res.send("NOT FOUND");
        }
    }
})
app.post("/refp_2",async(req,res)=>{
    const OTP=req.body.OTP;
    const actual_otp=req.body.actual_output;
    const pat_name=req.body.pat_name;
    if(OTP===actual_otp){
        patient_details.find({}).lean().exec(function(err,records){
            found=0;
            records.forEach(function(data){
                if(data.patientName===pat_name){
                    found=1;
                    send_details(found,data.email_password);
                }
            })
        })
    }
    else{
        res.send("Not Matched!");
    }
    function send_details(found,email){
        if(found===1){
            var mailOptions={
                from:'anandarshan.laurel@gmail.com',
                to:"anankrisuni@gmail.com",
                subject:'Insurance Claims',
                text:"the credentials of the patient is "+email
            };
            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Email sent: '+info.response);
                }
            });
            res.status(201).render("patient_login");
        }
    }
})
app.get("/insurance_claims",function(req,res){
    doctor_info.find({}).lean().exec(function(err,records){
        records.forEach(function(data){
            if(data.Name.substring(0,9)==="Insurance"){
                if(data.patient){
                    insurance_com(data.patient);
                }
            }
        })
    })
    function insurance_com(patients){
        res.status(201).render("insurance_list",{name:patients})
    }
})    

app.get("/create_insurance",function(req,res){
    doctor_info.find({}).lean().exec(function(err,records){
        records.forEach(function(data){
            if(data.Name.substring(0,9)==="Insurance"){
                if(data.patient){
                    insurance_com(data.patient);
                }
            }
        })
    })
    function insurance_com(patients){
        res.status(201).render("create_insurance",{name:patients})
    }
})
app.post("/push_block",async(req,res)=>{
    const patient_name=req.body.patient_name;
    const policy=req.body.policy;
    const insurance_type=req.body.type;
    const cause=req.body.cause;
    const cause_type=req.body.cause_type;
    const name=req.body.sign;
    const block_data={
        'patient_name':patient_name,
        'policy_number':policy,
        'insurance_type':insurance_type,
        'cause':cause,
        'cause_type':cause_type,
        'signature':name
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
      
        modulusLength: 2048,
    });
    console.log(publicKey.toString('base64'));

    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
  
        Buffer.from(JSON.stringify(block_data))
    );
    const PublicKeyBuffer = publicKey.export({ type: 'pkcs1', format: 'pem' })
    console.log();
    console.log(PublicKeyBuffer);
    console.log();
    const PrivateKeyBuffer = privateKey.export({ type: 'pkcs1', format: 'pem' })
    console.log();
    console.log(PrivateKeyBuffer);
    console.log();
    
    console.log("encypted data: ", encryptedData.toString("base64"));
    console.log(privateKey);

    const saving_data=new data_key({
        data:encryptedData.toString("base64"),
        public_key:PublicKeyBuffer,
        private_key:PrivateKeyBuffer,
        patient_name:patient_name+" Insurance"
    })
    await saving_data.save();
    
    const prev_hash=blockchain.getLastBlock()['hash']
    blockchain.createNewData(encryptedData.toString("base64"));
    const nonce=blockchain.pow(prev_hash,encryptedData.toString("base64"));
    const next_hash=blockchain.hashvalue(nonce,encryptedData.toString("base64"),prev_hash);
    blockchain.createNewBlock(nonce,prev_hash,next_hash);
    console.log(blockchain);
    const save_block=new blocks({
        index:blockchain.getLastBlock()['index'],
        nonce:nonce,
        timestamp:Date(Date.now().toString()),
        data:encryptedData.toString("base64"),
        prevhash:prev_hash,
        hash:next_hash,
        publickey:PublicKeyBuffer
    })
    await save_block.save();
    var mailOptions={
        from:'anandarshan.laurel@gmail.com',
        to:"anankrisuni@gmail.com",
        subject:'Access your insurance record',
        text:next_hash+" login into patient module and paste the block with your private key  "+PrivateKeyBuffer+" paste this to decrypt your file"
    };
    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err);
        }
        else{
            console.log('Email sent: '+info.response);
        }
    });


})
app.get("/form_creation",function(req,res){
    res.status(201).render("form_creation");
})
app.get("/",function(req,res){
    res.render("home_page");
})
app.get("/create_page",function(req,res){
    res.status(201).render("create_page");
})
app.get("/homepage",function(req,res){
    res.status(201).render("home_page");
})
app.get("/Allmodules",function(req,res){
    res.status(201).render("Allmodules");
})
app.get("/patient_login",function(req,res){
    res.status(201).render("patient_login");
})
app.get("/doctor_login",function(req,res){
    res.status(201).render("doctor_login");
})
app.get("/insurance_login",function(req,res){
    res.status(201).render("insurance_login");
})
app.get("/patient_list",function(req,res){
    res.status(201).render("patient_list");
})
app.get("/complete_patient",function(req,res){
    res.status(201).render("complete_patient");
})
app.get("/insurance_patients",function(req,res){
    res.status(201).render("insurance_patients");
})
app.get("/Reference_pages",function(req,res){
    res.status(201).render("Reference_pages")
})
const PORT=process.env.PORT||3000;
app.listen(PORT);