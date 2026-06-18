const departmenrt = require('../models/Department');

exports.getUserDepartment= async(req ,res)=>{
    try{
        const userdepartment = await  departmenrt.find();
        res.json(userdepartment)
    } catch(error)
{
    res.status(500).json({message:error.message})
}

}
exports.updateUserDepartment =async (req,res)=> {
    try{
        const {id}=req.params;
        const {departmentId} =req.body;
        const User = require('../models/User');
        const updateUser= await User.findByIdAndUpdate(
            id,
            {departmentId},
            {returnDocument: 'after'}
        );
        res.json(updateUser);
    }
    catch(error){
        res.status(500).json({message: error.message })
    }
}
