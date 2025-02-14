import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "PSMS"
    }).then(()=>{
        console.log("DB is Connected")
    }).catch((err=>{
        console.log("DB is not Connected")
    }))
}

//mongodb+srv://vpartheepan:school@cluster0.fwli1.mongodb.net/?retryWrites=true