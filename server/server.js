import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import resumeRouter from "./routes/resumeRouter.js"                                                                      
import aiRouter from "./routes/aiRoute.js"

const app=express()
const PORT=process.env.PORT||3000
// database connection
await connectDB()


app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>res.send("Server is live...🚀"))
app.use('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)

app.use('/api/ai',aiRouter)

// Return JSON 404 for any unmatched /api routes to avoid non-JSON HTML responses
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

app.listen(PORT,()=>{
  console.log(`Server is live at http://localhost:${PORT}🚀`)
})