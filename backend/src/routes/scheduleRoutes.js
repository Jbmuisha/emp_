const express =require("express");
const  route=express.Router();
const{createSchedule,getScheduler,getSchedulerId,updateSchedule,deleteSchedule}=require('../controllers/schedulerController');

route.post('/',createSchedule);

route.get('/',getScheduler);

route.get('/:id',getSchedulerId);

route.put('/:id',updateSchedule);

route.delete('/:id',deleteSchedule);