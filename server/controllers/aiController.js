// controller for enchancing a resume's professional summary
// POST:/api/ai/enhance-resume

import { response } from "express";
import Resume from "../models/Resume.js";
import ai from "../config/ai.js";


export const enhanceProfessionalSummary = async (req, res) => { 
  try { 
    const {userContent}=req.body;
    if(!userContent){return res.status(400).json({ message: "请输入简历内容" })}
    const response = await ai.chat.completions.create({
      model: process.env.QWEN_MODEL, 
      messages: [
        { "role": "system", "content": "你是一位资深简历顾问，专注于为求职者撰写 ATS 友好的职业概述。请将用户提供的原始内容精炼为 1–2 句专业、简洁的总结，突出其核心技能、关键经验与职业目标。语言需自然流畅、有说服力，避免空洞形容词。**仅返回优化后的文本，不要包含任何解释、标题、引号或额外内容。" },
        { "role": "user", "content": userContent }
      ],
      
    })
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) { 
    return res.status(400).json({ message: error.message });
  }
}; 

// controller for enhancing a resume's job description
// POST:/api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) { return res.status(400).json({ message: "请输入简历内容" }) }
    const response = await ai.chat.completions.create({
      model: process.env.QWEN_MODEL,
      messages: [
        { "role": "system", 
          "content": "你是一位专业简历优化师，擅长将普通的工作描述转化为高影响力的职业成就。请将用户输入改写为 1–2 句话，使用强动作动词（如“开发”“提升”“主导”“实现”），并尽可能加入可量化的成果（如“效率提升30%”）。内容需简洁、专业、ATS 友好。**仅返回改写后的句子，不要添加任何说明、序号、引号或额外文本" },

        { "role": "user", "content": userContent }
      ],
      
    })
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}; 

// controller for uploading a resume to the database
// POST:/api/ai/upload-resume
export const uplodaResume = async (req, res) => {
  try {
    
    const {resumeText,title}=req.body;
    const userId=req.userId;
    if(!resumeText){
      return res.status(400).json({ message: "请输入简历内容" })
    }

    const systemPrompt ="你是一个高精度的简历信息提取 AI，能从任意格式的中文或中英混合简历文本中，准确识别并结构化关键信息。"
    const userPrompt = `请严格从以下简历原文中提取数据，并** 仅输出一个符合指定结构的 JSON 对象 **，不要包含任何其他文字、注释、Markdown 或解释。

    输出必须满足：
    - 所有字段按以下结构定义；
    - 日期格式统一为 "YYYY.MM"（如 "2023.06"），若未提供则留空字符串；
    - 若某字段无信息，使用空字符串 "" 或空数组[]；
    - "isCurrent" 字段根据是否在职判断，若结束时间为空或含“至今”，则为 true；
- ** 绝对不要在 JSON 前后添加任何字符 **。

期望的 JSON 结构如下：
    {
      "professional_summary": "",
        "skills": [],
          "personal_info": {
        "image": "",
          "full_name": "",
            "profession": "",
              "email": "",
                "phone": "",
                  "location": "",
                    "linkedin": "",
                      "website": ""
      },
      "experience": [
        {
          "company": "",
          "position": "",
          "start_date": "",
          "end_date": "",
          "description": "",
          "isCurrent": false
        }
      ],
        "project": [
          {
            "name": "",
            "type": "",
            "description": ""
          }
        ],
          "education": [
            {
              "institution": "",
              "degree": "",
              "field": "",
              "graduation_date": "",
              "gpa": ""
            }
          ]
    }

    现在，请处理以下简历原文：
${ resumeText }`
    const response = await ai.chat.completions.create({
      model: process.env.QWEN_MODEL,
      messages: [
        {
          "role": "system",
          "content": systemPrompt
        },

        { "role": "user", "content": userPrompt }
      ],
      response_format: {
        type: "json_object"
      }
    })
    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume=await Resume.create({userId,title,...parsedData})
    return res.status(200).json({ resumeId:newResume._id,message: "上传简历成功" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}; 