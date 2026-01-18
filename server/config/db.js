import mongoose from "mongoose"

const connectDB = async () => {
  try{
    mongoose.connection.on("connected",()=>{
      console.log("Database Connected Successfully")})

      let mongodbURL = process.env.MONGODB_URL
      const projectName = 'resumeBuilder'
      if(!mongodbURL){
        throw new Error("MONGODB_URL is not defined in environment variables")
      }

      // Trim whitespace and surrounding quotes if present
      mongodbURL = mongodbURL.trim()
      if ((mongodbURL.startsWith('"') && mongodbURL.endsWith('"')) || (mongodbURL.startsWith("'") && mongodbURL.endsWith("'"))) {
        mongodbURL = mongodbURL.slice(1, -1)
      }

      // Remove trailing slashes
      while (mongodbURL.endsWith('/')) {
        mongodbURL = mongodbURL.slice(0, -1)
      }

      // Detect if the ORIGINAL env value already contains a database name (e.g., mongodb://host/dbname)
      const orig = process.env.MONGODB_URL ? process.env.MONGODB_URL.trim() : ''
      const hasDb = /mongodb(\+srv)?:\/\/[^\/]+\/[^\/?]+/.test(orig)

      const connectString = hasDb ? mongodbURL : `${mongodbURL}/${projectName}`

      // Mask credentials if present when logging
      const masked = connectString.replace(/:\/?\/.+@/, '://***@')
      console.log('Connecting to MongoDB at', masked)

      // Use mongoose's default connection behavior; do not pass deprecated/unsupported low-level options
      await mongoose.connect(connectString)
      console.log('Mongoose connected, version:', mongoose.version)
  }
     catch(error){
      console.error("Error connecting to database:",error)
      // Exit process so the failure is visible and the server doesn't run in an invalid state
      process.exit(1)
    }
  
}

export default connectDB