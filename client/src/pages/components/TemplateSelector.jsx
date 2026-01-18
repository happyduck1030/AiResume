import React, { useState } from 'react'
import { Layout,Check } from 'lucide-react';

import Preview from '../Preview';

const TemplateSelector = ({selectedTemplate,onChange}) => {
  const [isOpen, setIsOpen]=useState(false);
  const templates = [
    { id:'classic',name: "Classic",preview:"A clean,traditional resume format with clear sections and preofessional typography" },
    { id:'minimal',name: "Minimal", preview:"A clean, minimal resume format with a focus on simplicity and readability" },
    { id:'minimal-image',name: "Minimal Image", preview:"A minimal resume format with a focus on simplicity and readability, including an image section" },
    { id:'modern',name: "Modern", preview:"A modern resume format with a clean layout and contemporary design elements" },
  ];
  return (
    <div className='relative'>
        <button onClick={()=>setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-blue-300 hover:ring transition-all px-3 py-2 rounded-xl' >
        <Layout size={14}></Layout><span className='max-sm:hidden'>Template</span>
        </button>
        {isOpen&&(
          <div className='absolute top-full '>
            <div className='absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded border border-gray-200 shadow-sm'>
              {templates.map((template)=>(
                <div key={template.id} className={`relative p-3 border rounded-md cursor-pointer transition-all ${selectedTemplate===template.id?'border-blue-500 ring-2 ring-blue-200 bg-blue-100':'border-gray-300 hover:border-gray-400 hover:bg-gray-100'}`} 
                onClick={()=>{onChange(template.id); setIsOpen(false)}}> 
                 {selectedTemplate===template.id&&(
                  <div className='absolute top-2 right-2 '>
                    <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                      <Check className="w-3 h-3 text-white"></Check>
                    </div>
                  </div>
                )}
                <div className='space-y-1'>
                  <h4 className='font-medium text-gray-800'>{template.name}</h4>
                  <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500'>{template.preview}</div>
                </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

export default TemplateSelector