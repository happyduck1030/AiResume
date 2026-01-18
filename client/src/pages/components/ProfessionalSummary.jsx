import { Loader2, Sparkles } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import {toast} from 'react-hot-toast'
import api from '../../configs/api'

const ProfessionalSummary = ({data,onChange,setResumeData}) => {

  const token =useSelector(state=>state.auth.token)
  const [isGenerating,setIsGenerating]=useState(false)

  const generateSummary=async()=>{ 
    try{
      setIsGenerating(true)
      const prompt = `enhance my professional summary: ${data}`
      const response = await api.post('/api/ai/enhance-pro-sum', { userContent: prompt }, { headers: { Authorization: token } })
      // update the textarea via the passed onChange handler so the displayed value updates
      if (response?.data?.enhancedContent) {
        onChange(response.data.enhancedContent)
      }

    }catch(error){
      toast.error(error?.response?.data?.message|| error.message)
    }
    finally{
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className=''>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
          <p className='text-sm text-gray-500 '>Add some words about your resume here</p>
        </div>
        <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
          {isGenerating ? (<Loader2 className='size-4 animate-spin' />) :
            (<Sparkles className='size-4' />)}{isGenerating ? "Enhancing" :"AI Enhance"}        </button>
      </div>

      <div className='mt-6'>
        <textarea value={data ||""} rows={7} name="" id="" onChange={(e)=>{onChange(e.target.value)}}
        className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-blue-500
        outline-none transition-colors resize-none
        ' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'></textarea>
        <p>Tips:Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills</p>
      </div>
    </div>
  )
}

export default ProfessionalSummary