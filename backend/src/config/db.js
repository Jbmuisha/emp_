
require("dotenv").config({ path: './backend/.env', quiet: true });
const mongoose = require("mongoose")

const mongodb= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongo is conneted");
        
    } catch(error
    ){
        console.error(" DAtabase connection failed  ");
        process.exit(1)
        

    }

}
module.exports=mongodb;