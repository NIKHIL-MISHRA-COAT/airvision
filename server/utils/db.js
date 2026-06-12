import mongoose from"mongoose"
    
const connectDB =  async ()=>{
    mongoose.connect("mongodb+srv://COAT-Nikhil:COAT-Nikhil@airvision.fkjin.mongodb.net/?retryWrites=true&w=majority&appName=AirVision").then(()=>{
        console.log("Db connected")
      }).catch((error)=>{
        console.log("Db connection failed")
        console.log(error)
        process.exit(0)
      })
}
export default   connectDB;




