import { User } from "./models/userSchema.js";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

// Connect to database
dbConnection();

const adminUser = {
    name: "Admin User",
    email: "admin@sunshine.com",
    password: "admin123",
    role: "Admin"
};

const sampleParents = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
        role: "Parent"
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "123456",
        role: "Parent"
    }
];

const sampleTeachers = [
    {
        name: "Sarah Wilson",
        email: "sarah@sunshine.com",
        password: "teacher123",
        role: "Teacher"
    },
    {
        name: "Mike Johnson",
        email: "mike@sunshine.com",
        password: "teacher123",
        role: "Teacher"
    }
];

// Import Data
const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        console.log("Data deleted successfully");

        // Create admin user
        await User.create(adminUser);
        console.log("Admin user created successfully");

        // Create sample parents
        await User.insertMany(sampleParents);
        console.log("Sample parents created successfully");

        // Create sample teachers
        await User.insertMany(sampleTeachers);
        console.log("Sample teachers created successfully");

        console.log("All data imported successfully");
        process.exit();
    } catch (error) {
        console.error("Error importing data:", error);
        process.exit(1);
    }
};

// Delete Data
const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log("Data deleted successfully");
        process.exit();
    } catch (error) {
        console.error("Error deleting data:", error);
        process.exit(1);
    }
};

// Add these scripts to package.json
if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
} 