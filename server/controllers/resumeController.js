import imagekit from "../config/imagekit.js"
import Resume from "../models/Resume.js"
import fs from 'fs'
import path from 'path'

// controller for 创建一个新简历
// POST:/api/resumes/create
export const createResume = async (req, res) => {
  try{
    const userId=req.userId
    const {title}=req.body

    //创建新简历
    const newResume=await Resume.create({userId,title})
    return res.status(201).json({ message: "创建简历成功", resume:newResume })
  }catch (error) {
    return res.status(400).json({ message: "创建简历失败", error })
  }
}

// 删除简历
// DELETE:/api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId
    const { resumeId } = req.params

    // 删除简历
    await Resume.findByIdAndDelete({userId,_id:resumeId})
    return res.status(200).json({ message: "删除简历成功" })
  
  } catch (error) {
    return res.status(400).json({ message: "创建简历失败", error })
  }
}

// get user resume by id
// GET:/api/resumes/:id
export const getResumeById=async(req,res)=>{ 
  try{
    const userId=req.userId
    const {resumeId}=req.params
    const resume=await Resume.findOne({userId,_id:resumeId}) 
    if(!resume){
      return res.status(400).json({ message: "未找到简历" })
    }
    resume.__v=undefined
    resume.createdAt=undefined
    resume.updatedAt=undefined
    return  res.status(200).json({ message: "获取简历成功", resume })
  }catch(error){
    return res.status(400).json({ message:error.message })
  }
}

// get resume by id public
// GET:/api/resumes/public
export const getPublicResumeById=async(req,res)=>{
  try{
    const {resumeId}=req.params
    const resume =await Resume.findOne({_id:resumeId})
    if(!resume){
      return res.status(404).json({ message: "未找到简历" })
    }
    return res.status(200).json({ message: "获取简历成功", resume })
  }catch(error){
    return res.status(400).json({ message:error.message })
  } 
} 

// controller for updating a resume
// PUT:/api/resumes/update
export const updateResume = async (req, res) => { 
  console.log('Headers:', req.headers['content-type']);
  console.log('Files:', req.file);
  console.log('Body:', req.body);
  try{
   
    const userId=req.userId
    const {resumeId,resumeData,removeBackground}=req.body
    const image=req.file;

    let resumeDataCopy;
    if(typeof resumeData==='string'){
      resumeDataCopy =await JSON.parse(resumeData)
    }else{
      resumeDataCopy=structuredClone(resumeData)
    }
    // =JSON.parse(JSON.stringify(resumeData))
    if(image){
      const imagePath = path.resolve(image.path)
      console.log('Resolved imagePath:', imagePath)
      const exists = fs.existsSync(imagePath)
      console.log('File exists:', exists)
      if(!exists){
        return res.status(400).json({ message: 'Uploaded file not found on server', path: imagePath })
      }
      const imageBufferData = fs.createReadStream(imagePath)
      try{
        
        const response = await imagekit.files.upload({
          file: imageBufferData,
          fileName: 'resume-' + Date.now() + path.extname(image.originalname || ''),
          folder: 'user-resumes',
          transformation:{
            pre:'w-300,h-300,fo-face,z-0.75'+(removeBackground?',e-bgremove':'')

          }
        });
        
        resumeDataCopy.personal_info.image = response.url
      }catch(uploadErr){
        console.error('ImageKit upload error:', uploadErr?.message || uploadErr)
        // include response data if present
        if(uploadErr?.response) console.error('ImageKit response:', uploadErr.response)
        return res.status(400).json({ message: 'Image upload failed', error: uploadErr?.message || uploadErr })
      }
    }
    const resume= await Resume.findByIdAndUpdate({userId,_id:resumeId},resumeDataCopy,{new:true})

    return res.status(200).json({ message: "更新简历成功", resume })

  }catch(error){ 
    return res.status(400).json({ message: "更新简历失败", error })
  }
}

