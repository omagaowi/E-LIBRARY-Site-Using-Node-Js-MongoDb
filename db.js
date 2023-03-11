const { MongoClient } = require('mongodb');

let dbConnection
module.exports = {
    connectToDb: (cb)=>{
        MongoClient.connect('mongodb+srv://omagaowi:cre8tive@cluster0.us3xofs.mongodb.net/E_LIBRARY?retryWrites=true&w=majority').then((client)=>{
            dbConnection = client.db()
            return cb()
        }).catch(err=>{
            // console.log(err)
            return cb()
        })
    },
    getDb: ()=> dbConnection
}

