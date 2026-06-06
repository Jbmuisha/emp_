require("dotenv").config({ path: './backend/.env', quiet: true });
const exp = require("express");
const cors = require("cors");
const mongodb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app=exp();
//the problem of cors de fois 
app.use(cors());
app.use(exp.json());

// Connect to MongoDB and start server
const startServer = async () => {
  await mongodb();
  
  // Routes
  app.use("/api/auth", authRoutes);

  app.get("/",(req ,res)=>{
      res.json(
          {
              message:"The API is running"
          }
      );

  });
  const PORT = 5000 ;
  app.listen(PORT,()=>{
      console.log(`Server running on ${PORT}`);
  })
};

startServer();
