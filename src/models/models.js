/* 
    This is a model function
    containing models to main components
    of the faucet system
*/

//Import the mongoose module
const mongoose = require('mongoose');
const schema = mongoose.Schema
const uuid = require('uuid')

//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1:27017/faucetdatabase';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//creating REQUEST database class
class _Request{
    /*
        This class controls the Request
        model database connection
    */
    model = null;
    constructor(){
        //initialize database schema
        this.model = mongoose.model('request', (new schema({
            id:String, status:String, created:Number,
            finished:Number, address:String, tx:String
        })))
    }

    create(addr, func){
      /*
        This functions create a new request
        data and store in the database
        It returns the request Id
      */
       //create id
       let _id = uuid.v4();
       let mData = {id:_id,status:"started", created: Date.now(), finished: Date.now(), address:addr, tx:" "}
       new this.model(mData)
       .save((err) =>{
           if(err) func({status:'error',msg:'Internal database error'})
           func({status:true}, _id) 
       })
     }
    save(params, func){
       /*
        This functions saves or modify a request
        data and store in the database
        It returns either true|false|null
      */ 
       //get the specified request from database
       if(params.id != undefined && params.id != null){
           //validate results
           if(params.status != undefined && params.status != null){
               let p = params.status.toLowerCase()
               if(p != "success" && p!= "failed" && p!="pending" && p!="ineligible" && p!="invalid"){
                   func({status:'error',msg:'Invalid status data'})
                   return;
               }
           }
           let p = {}
           if(params.status){
                p.status = params.status.toLowerCase()
                //check if its finished
                if(p.status == 'success' || p.status == 'failed'){
                    //add finished parametres
                    p.finished = Date.now()
                }
            }
           if(params.tx){
              p.tx = params.tx 
           }
           if(params.address){
                p.address = params.address 
           }
           this.model.findOneAndUpdate({'id':params.id}, p,{new:true}, (err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){
                    func({status:true})
                }                         
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No request id found'})
       }
    }
    get(id, func){
      /*
        This functions get a request
        data and store in the database
        It returns the request Json data
      */
          if(id){
           //find the request dat
            this.model.find({'id':id},(err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){
                    res = res[0]
                    let p = {
                        status:res.status,id:res.id,address:res.address,
                        created:res.created,finished:res.finished,tx:res.tx
                    }
                    func({status:true}, p)
                }
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No request id found'})
       }
    }
    
}
//creating WALLET database class
class _Wallet{
    /*
        This class controls the Wallet
        model database connection
    */
    model = null;
    constructor(){
        //initialize database schema
        this.model = mongoose.model('wallet', (new schema({
            id:String,  address:String, lastfunded:Number, amount:Number
        })))
    }

    create(addr, func){
      /*
        This functions create a new wallet
        data and store in the database
        It returns the wallet Id
      */
       //create id
       let _id = uuid.v4();
       let mData = {id:_id,lastfunded:0,address:addr + "", amount:0}
       new this.model(mData)
       .save((err) =>{
           if(err) func({status:'error',msg:'Internal database error'})
           func({status:true}, _id) 
       })
     }
    save(params, func){
       /*
        This functions saves or modify a wallet
        data and store in the database
        It returns either true|false|null
      */ 
       //get the specified request from database
       if(params.id != undefined && params.id != null){
           let p = {}
           if(params.lastfunded){
              p.lastfunded = params.lastfunded 
           }
           if(params.address){
                p.address = params.address + ""
           }
           if(params.amount){
                p.amount = params.amount 
           }
           this.model.findOneAndUpdate({'id':params.id}, p,{new:true}, (err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){
                    func({status:true})
                }                         
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No request id found'})
       }
    }
    get(id, func){
      /*
        This functions get a wallet
        data and store in the database
        It returns the wallet Json data
      */
          if(id){
           //find the request dat
            this.model.find({'id':id},(err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                if(res != null){
                    res = res[0]
                    let p = {
                        lastfunded:res.lastfunded,id:res.id,address:res.address,
                        amount:res.amount 
                    }
                    func({status:true}, p)
                }
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No request id found'})
       }
    }
    find(addr, func){
      /*
        This functions finds a wallet
        data and using any address given  
        It returns the wallet Json data
      */
        if(addr){
           //find the request dat
            this.model.find((err, res) =>{
                if(err) func({status:'error',msg:'Internal database error'})
                for(let i=0;i<res.length;i++){
                    //turn address to array
                    if(res[i].address.split(",").includes(addr)){
                        //has found
                        let p = {
                            lastfunded:res[i].lastfunded,id:res[i].id,address:res[i].address,
                            amount:res[i].amount 
                        }
                        func({status:true}, p)
                        return;
                    }
                }
                func({status:true}, null)
           })
           
       }
       else{
           //no request id found
           func({status:'error',msg:'No address found'})
       }  
    }
}
//create request and wallet objects for exports
const _request = new _Request()
const _wallet = new _Wallet()
 


//exports modules
exports.walletDb =  _wallet
exports.requestDb = _request