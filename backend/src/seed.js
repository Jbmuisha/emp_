require("dotenv").config({ path: './.env', quiet: true });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Department = require("./models/Department");

// sourcery skip: use-object-destructuring
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL ;

const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD ;


const createDefaultUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

// Check if admin user already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      console.log(`📧 Email: ${DEFAULT_ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${DEFAULT_ADMIN_PASSWORD}`);
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);

      // Create default admin user
      const adminUser = new User({
        username: "Admin",
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin"
      });

      await adminUser.save();
      console.log("✅ Default admin user created successfully!");
      console.log(`📧 Email: ${DEFAULT_ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${DEFAULT_ADMIN_PASSWORD}`);
      console.log("👤 Role: admin");
    }

    // Seed default departments
    const defaultDepartments = [
      { name: "HR", description: "Human Resources" },
      { name: "Engineering", description: "Engineering" },
      { name: "Sales", description: "Sales" },
      { name: "Marketing", description: "Marketing" },
      { name: "Finance", description: "Finance" },
    ];

    for (const dept of defaultDepartments) {
      const existingDept = await Department.findOne({ name: dept.name });
      if (!existingDept) {
        await Department.create(dept);
        console.log(`✅ Department created: ${dept.name}`);
      } else {
        console.log(`⚠️ Department already exists: ${dept.name}`);
      }
    }
    console.log("✅ Default departments seeded successfully!");

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating default user:", error.message);
    process.exit(1);
  }
};

createDefaultUser();
