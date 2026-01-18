import React, { useState,useEffect  } from 'react'
import { Upload, UploadCloudIcon, Plus, TrashIcon, FilePenLineIcon,PencilIcon ,XIcon, UploadCloud, LoaderCircleIcon, AwardIcon} from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'
import  pdfToText  from 'react-pdftotext'


const dashboard = () => {
  const {user,token}=useSelector(state=>state.auth)

  const colors=['#9333ea','#d97706','#dc2626','#0284c7','16a34a']
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const navigate=useNavigate()

  const loadAllResumes = async () => {
    try{
      const {data}=await api.get('/api/users/resumes',{headers:{Authorization:token}}
      )
      setAllResumes(data.resumes)
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || err.message)
    }
    // setAllResumes(dummyResumeData)
  }
  const createResume = async (e) => {
   try{
    e.preventDefault()
    console.log('title',title)
    const {data}=await api.post('/api/resumes/create',{title},{headers:{Authorization:token}})
    setAllResumes([...allResumes,data.resume])
    setTitle('')
    setShowCreateResume(false)
    navigate(`/app/builder/${data.resume._id}`)
   }catch(err){
    console.log(err)
    toast.error(err?.response?.data?.message || err.message)
  }
    
  
  }
  const uploadResume = async (e) => {
    e.preventDefault()
    
    // Validate that a file is selected
    if (!resume) {
      toast.error('Please select a PDF file')
      return
    }

    // Validate that a title is provided
    if (!title.trim()) {
      toast.error('Please enter a resume title')
      return
    }

    setIsLoading(true)
    try{
      const resumeText = await pdfToText(resume)
      
      // Validate that PDF extraction was successful
      if (!resumeText || resumeText.trim() === '') {
        toast.error('Failed to extract text from PDF. Please try another file.')
        setIsLoading(false)
        return
      }

      const { data } = await api.post('/api/ai/upload-resume', {title, resumeText },{headers:{Authorization:token}})
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || err.message)
    }
    setIsLoading(false)
  }
  const deleteResume = async (resumeId) => {
    try{ 
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if (confirm) {
        // setAllResumes(prev => prev.filter(resume => resume._id !== resumeId))
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success(data.message)
      }
      console.log('delete resume')
    } catch(err){
    console.log(err)
    toast.error(err?.response?.data?.message || err.message)
  }
    
  
  }
  const editTile = async (e) => {
    e.preventDefault()
    try{ 
      
      const {data}=await api.put(`/api/resumes/update/`,{resumeId:editResumeId,resumeData:{title}},{headers:{Authorization:token}})
      console.log('API response data:', data);
      setAllResumes(allResumes.map(resume=>resume._id===editResumeId?{...resume,title:data.resume.title}:resume))
      setEditResumeId('')
      toast.success(data.message)
    } catch(err){
    console.log(err)
    toast.error(err?.response?.data?.message || err.message)
  }
    
  }
  useEffect(() => {
    loadAllResumes()
  }, [])
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome , John Doe
        </p>
        <div className='flex gap-4'>
          <button onClick={()=>setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed
          border-slate-300 group hover:border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer
          '>
            <Plus className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-green-300 to-green-500 text-white rounded-full'></Plus>
            <p className='text-md group-hover:text-green-600 transition-all'>Create Resume</p>
          </button>

          <button onClick={()=>setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed
          border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer
          '>
            <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'></UploadCloudIcon>
            <p className='text-md group-hover:text-purple-600 transition-all'>Upload Existing</p>
          </button>
        </div>
        <hr className='border-slate-300 my-6 sm:w-[305px]'/>
        <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
          {allResumes.map((resume,index)=>{
            const baseColor=colors[index%colors.length]
            return(
              <button key={index} onClick={()=>navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center
              rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer
              ' style={{backgroundColor:`linear-gradient(135deg,${baseColor}10,${baseColor}40)` ,borderColor:baseColor+'40'}}>
                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" style={{ color: baseColor }}>  </FilePenLineIcon>
                  <p className='text-sm group-hover:text-white group-hover:scale-105 transition-all px-2 text-center' style={{color:baseColor}}>{resume.title}</p>
                  <p className='absolute bottom-1  text-slate-400 group-hover:text-white text-center duration-300 px-2 transition-all text-[11px]'
                   style={{color:baseColor+'90'}}>
                    Updated on {new Date(resume.updatedAt).toLocaleDateString()}</p>
                    <div onClick={e=>e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                  <TrashIcon onClick={(e) => {e.stopPropagation(); deleteResume(resume._id)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" ></TrashIcon>
                  <PencilIcon onClick={(e) => {e.stopPropagation(); setEditResumeId(resume._id);setTitle(resume.title);console.log(editResumeId)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" ></PencilIcon>
                    </div>
              </button>
            )
          })}
        </div>

        {showCreateResume &&(
          <form onSubmit={createResume} onClick={()=>setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-2xl font-bold mb-4'>创建一个简历</h2>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
                <button  className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" 
                onClick={()=>{setShowCreateResume(false);setTitle('')}}></XIcon>
              </div>
          </form>
        )
        }

        {showUploadResume &&(
          <form onSubmit={uploadResume} onClick={()=>setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-2xl font-bold mb-4'>上传简历</h2>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
                <div>
                  <label htmlFor="resume-input" className='block text-sm text-slate-700'>
                    Select resume file
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                      {resume?(
                        <p className='text-green-700'>{resume.name}</p>
                      ):(
                        <UploadCloud className='size-14 stroke-1'/>
                      )}
                    </div>
                  </label>
                  <input type="file" id="resume-input" hidden accept='.pdf' onChange={(e)=>setResume(e.target.files[0])} />
                </div>
                <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex justify-center items-center gap-2'>
                {isLoading&&<LoaderCircleIcon className='size-4 text-white animate-spin'/>}
                {isLoading?'Uploading...':'Upload Resume'}
                </button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" 
                onClick={()=>{setShowUploadResume(false);setTitle('')}}></XIcon>
              </div>
          </form>
        )}
  {/* 编辑弹窗*/}
        {editResumeId && (
          <form onSubmit={editTile} onClick={() => setEditResumeId(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-2xl font-bold mb-4'>编辑简历标题</h2>
              <input value={title} onChange={e=>setTitle(e.target.value)} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>更新</button>
              <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => { setEditResumeId(''); setTitle('') }}></XIcon>
            </div>
          </form>
        )
        }
      </div>
    </div>
  )
}

export default dashboard