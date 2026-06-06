const mongoose = require("mongoose");

const employeeShema = new mongoose.Schema (

    {
       firstname : String,
       lastname  : String,
       email :String,
       phone : String,
       position : String,
       salary : Number,
       department : String,

    });
    module.exports=mongoos.models("employees",employeeShema);