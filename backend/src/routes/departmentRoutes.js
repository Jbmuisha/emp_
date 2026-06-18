const  express =require("express");
const router = express.Router();
const {getUserDepartment,updateUserDepartment} =require("../controllers/departmentController");

router.get('/',getUserDepartment);
router.put('/:id',updateUserDepartment)


