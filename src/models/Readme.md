Readme

    This modules contains model for request and wallet db
    The database schema can be found in the schema.txt
    
    All the callback uses the pattern
    callback(status:Json, result)
    where the status is in the format {status:true|'error', msg:<error message>}
        
    Request model
    
        create(address, callback)
            Creates a new request instance using the address as arguements
            returns the uuid v4 of the request, this is needed to modify this request
            object and to get the object
            
        save(params, callback)
            Modifies an existing request instance,
            params include {status:String(failed|success|pending|invalid|ineligible, tx:String, address:String}
            returns a status Json
            
        get(id, callback)
            To fetch an existing request instance using its uuid v4 Id
            returns a request Json data
            
            
    Wallet Model
        
        create(address<array>, callback)
            Creates a new wallet instance using the address as arguements
            returns the uuid v4 of the wallet, this is needed to modify this wallet
            object and to get the object
            
        save(params, callback)
            Modifies an existing wallet instance,
            params include {lastfunded:Unix timestamp, amount:Number, address:<array>}
            returns a status Json
            
        get(id, callback)
            To fetch an existing wallet instance using its uuid v4 Id
            returns a wallet Json data
            
        find(addr:String, callback)
            To find a wallet instance using any of its address as arguement
            returns a wallet Json data 