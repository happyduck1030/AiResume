import { ArrowLeft, FileText, GraduationCap, Briefcase, User, FolderIcon, Star, ChevronRight, ChevronLeft, Share2Icon, DownloadIcon,EyeOffIcon,EyeIcon} from 'lucide-react'
import React, { act, use, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PersonalInfomation from './components/PersonalInfomation'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from './components/ResumePreview'
import TemplateSelector from './components/TemplateSelector'
import ColorPicker from './components/ColorPicker'
import ProfessionalSummary from './components/ProfessionalSummary'
import ExperienceForm from './components/ExperienceForm'
import EducationForm from './components/EducationForm'
import ProjectForm from './components/ProjectForm'
import SkillsForm from './components/SkillsForm'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'




const ResumeBuilder = () => {

  const {resumeId}=useParams()
  const {token}=useSelector(state=>state.auth)
  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    personal_info: {},
    accent_color: '#3B82F6',
    public:false,
  })
  console.log('URL resumeId:', resumeId); 
  console.log('resumeData:', resumeData);

  const loadExistingResume = async (id) => { 
   try{
    const {data}=await api.get('/api/resumes/get/'+resumeId,{ headers:{Authorization:token} })
    if(data.resume){
      setResumeData(data.resume)
      document.title=data.resume.title
    }
   }
   catch(error){
    console.log(error)
   }
  
  }
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const sections=[
    {id:"personal",name:"Personal Summary", icon:User},
    {id:"summary",name:"Summary", icon:FileText}
    ,{id:"experience",name:"Experience", icon:Briefcase}
    ,{id:"education",name:"Education", icon:GraduationCap}
    ,{id:"project",name:"Project", icon:FolderIcon}
    ,{id:"skills",name:"Skills", icon:Star}
  ]
  const activeSection =sections[activeSectionIndex];
  useEffect(() => {
    console.log(resumeId)
    loadExistingResume(resumeId)
  }, [resumeId])

  const changeResumeVisibility = async (id, visibility) => {
    // setResumeData({...resumeData,public:!resumeData.public})
    try{
     const formData=new FormData()
     formData.append('resumeId',resumeId)
     formData.append('resumeData',JSON.stringify({public:!resumeData.public}))
      const { data } = await api.put('/api/resumes/update' ,formData, { headers: { Authorization: token } })
      setResumeData({...resumeData,public:!resumeData.public})
      TableRowsSplit.success(data.message)
      if(data.success){
        setResumeData(prev=>({...prev,public:visibility}))
      }
    }catch(error){
      console.error("changeResumeVisibility error",error)
    }

  }
  const handleShare=()=>{
    const frontendUrl=window.location.href.split('/app')[0]
    const resumeUrl=frontendUrl+'/view/'+resumeId
    if(navigator.share){
      navigator.share({
        title: 'Resume Builder',
        text: '我的简历',
        url: resumeUrl,
      })
    }else{
      navigator.clipboard.writeText(resumeUrl)
      alert('Resume URL copied to clipboard')
    }
  }

  const downloadResume=()=>{
    window.print()
  }
  const saveResume=async()=>{
    try{
      let updatedResumeData=structuredClone(resumeData)
      // 删除上传的简历数据的图片
      if(typeof resumeData.personal_info.image==='object'){
        delete updatedResumeData.personal_info.image
      }
      const formData=new FormData()
      formData.append('resumeId',resumeId)
      formData.append('resumeData',JSON.stringify(updatedResumeData))
      removeBackground && formData.append('removeBackground',true)
      typeof resumeData.personal_info.image==='object' && formData.append('image',resumeData.personal_info.image)
      const {data}=await api.put('/api/resumes/update',formData,{headers:{Authorization:token}})
      console.log(data)
      setResumeData(data.resume)
      toast.success(data.message)
      
    }catch(error){ 
      console.error("saveResume error",error)
    }
  }
  return (
    <div>

        <div className='max-w-7xl mx-auto px-4 py-6'>
          <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeft className='size-4' />Back to Dashboard
          </Link>
        </div>

        <div className='max-w-7xl mx-auto px-4 pb-8'>
         <div className='grid lg:grid-cols-12 gap-8'>
          {/* 左侧仪表 */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 pt-1'>
               {/*progress bar using activeSectionIndex  */}
                <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
                <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transition-all duration-2000'
                style={{width:`${activeSectionIndex*100/(sections.length-1)}%`}}
                />
              {/* section Navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
              <div className='flex items-center gap-2'>
                 <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev,template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev=>({...prev,accent_color:color}))}></ColorPicker>
              </div>
              <div className='flex items-center'>
                {activeSectionIndex!==0&&(
                  <button className='flex items-center gap-1 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex===0}
                  onClick={()=>setActiveSectionIndex((preIndex)=>Math.max(preIndex-1,0))}
                  >
                    <ChevronLeft className='size-4' /> Previous
                  </button>
                )}
                  <button className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all
                  ${activeSectionIndex===sections.length-1?'opacity-50 cursor-not-allowed':''}
                  `} disabled={activeSectionIndex === sections.length - 1}
                    onClick={() => setActiveSectionIndex((preIndex) => Math.min(preIndex + 1, sections.length - 1))}
                  >
                    Next <ChevronRight className='size-4' /> 
                  </button>
              </div>
              </div>
                  
                  {/* 表单内容 */}
              <div className='space-y-6'>
                    {activeSection.id==="personal"&&(
                      <PersonalInfomation data={resumeData.personal_info} onChange={(data)=>setResumeData((preData)=>({...preData,personal_info:data}))}
                       removeBackground={removeBackground} setRemobveBackground={setRemoveBackground}></PersonalInfomation>
                      )}
                      {
                        activeSection.id==="summary" &&(
                          <ProfessionalSummary data={resumeData.professional_summary}
                          onChange={(data)=>setResumeData(prev=>({...prev,professional_summary:data}))} setResumeData={setResumeData}
                          ></ProfessionalSummary>
                        )
                      }
                      {activeSection.id==="experience" &&(
                        <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev,experience:data}))}></ExperienceForm>
                      )}
                      {activeSection.id === "education" && (
                        <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}></EducationForm>
                      )}
                      {activeSection.id === "project" && (
                        <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))}></ProjectForm>
                      )}
                      {
                        activeSection.id==="skills" &&(
                          <SkillsForm data={resumeData.skills} onChange={(data)=>setResumeData(prev=>({...prev,skills:data}))}></SkillsForm>
                        )
                      }
              </div>
                  <button onClick={()=>{toast.promise(saveResume,{loading:'Saving...'})}} className='bg-gradient-to-br from-green-100 to green-200 ring-green-300 text-green-600 ring hover:ring-green-400
                  transition-all rounded-md px-6 py-2 mt-6 text-sm
                  '>
                    Save Changes
                  </button>
            </div>
          </div>

          {/* 右侧表单 */}
          <div className='lg:col-span-7 max-lg:mt-6'>
                  <div className='relative w-full'>
                      <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                        {resumeData.public&&(
                          <button onClick={handleShare}
                          className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-300 to-blue-200 text-blue-600
                          rounded-lg ring-blue-300 hover:ring transition-colors
                          '>
                            <Share2Icon className='size-4'></Share2Icon>Share
                          </button>
                        )}
                        <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200
                        text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors
                        '>
                          {resumeData.public ? <EyeIcon className='size-4'></EyeIcon>:<EyeOffIcon className='size-4'></EyeOffIcon>}
                          {resumeData.public ? "Public" : "Private"}
                        </button>
                    <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200
                  text-green-600 ring-green-300 rounded-lg hover:ring transition-colors'>
                        <DownloadIcon className='size-4'></DownloadIcon> Download
                        </button>
                      </div>
                  </div>
                  {/* 简历预览 */}
                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
         </div>
        </div>
    </div>
  )
}

export default ResumeBuilder