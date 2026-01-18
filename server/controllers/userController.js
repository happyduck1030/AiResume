import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Resume from "../models/Resume.js"

const generateToken=(userId)=>{ 
  const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
  return token;
}

// POST:/api/users/register
export const registerUser=async(req,res)=>{
    try{
      console.log('register payload:', req.body)
      const {name,email,password}=req.body
      if(!name||!email||!password){
        return res.status(400).json({message:"缺少必要字段（用户名，邮箱，密码）"})
      }
      // 检查用户是否重复
      const user=await User.findOne({email})
      if(user){
        return res.status(400).json({message:"用户已存在"})
      }
      // 创建用户
      const hashedPassword=await bcrypt.hash(password,10)
      const newUser=await User.create({name,email,password:hashedPassword})
     
      const token=generateToken(newUser._id)
      newUser.password=undefined
      return res.status(201).json({message:"注册成功",token,user:newUser})
    }catch(error){
      console.error('register error:', error)
      if (error.code === 11000) {
        return res.status(400).json({ message: "邮箱已被使用" })
      }
      return res.status(400).json({ message:"注册失败", error: error.message })
    }
} 

// 用户登录
// POST:/api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if ( !email || !password) {
      return res.status(400).json({ message: "缺少必要字段（邮箱，密码）" })
    }
    // 查找用户
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "无效的邮箱或密码" })
    }
    //检查密码是否正确
    if(!user.comparePassword(password)){
      return res.status(400).json({ message: "无效的邮箱或密码" })
    }
    const token=generateToken(user._id)
    user.password=undefined
    return res.status(200).json({ message: "登录成功", token, user })
  } catch (error) {
    console.error('login error:', error)
    return res.status(400).json({ message: "登录失败", error: error.message })
  }
} 

// 通过id获取用户信息
// GET:/api/users/:id
export const getUserById = async (req, res) => {
  try {
   const userId=req.userId

  //  检查用户是否存在
  const user=await User.findById(userId)
  if(!user){
    return res.status(404).json({ message: "用户不存在" })
  }
  // 返回用户信息
  user.password=undefined
  return res.status(200).json({ message: "获取用户信息成功", user })
  } catch (error) {
    return res.status(400).json({ message: "获取用户信息失败", error })
  }
} 

// controller for getting user resumes
// GET:/api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId=req.userId
    // 检查用户是否存在
    const user=await User.findById(userId)
    if(!user){
      return res.status(404).json({ message: "用户不存在" })
    }
    // 获取用户简历
    const resumes=await Resume.find({userId})
    return res.status(200).json({ message: "获取用户简历成功", resumes })
  }catch (error) {
    console.error('getUserResumes error:', error)
    return res.status(400).json({ message: "获取用户简历失败", error: error.message })
  }
} 