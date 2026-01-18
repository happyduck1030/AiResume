import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ModernTemplate from './templates/ModernTemplate'

const ResumePreview = ({data,template,accentColor,classes=""}) => {

   const renderTemplate = (template) => { 
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />
        default:break;
        
    }
  };
  return (
    <div className='w-full bg-gray-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none"
          + classes}>
            {renderTemplate(template)}
        </div>
        <style>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            /* 隐藏所有元素 */
            body * {
              visibility: hidden;
            }
            /* 只显示 #resume-preview 及其子元素 */
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            /* 将简历区域移到打印页面左上角 */
            #resume-preview {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important; /* 修正拼写错误 */
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
            }
          }
        `}
        </style>
    </div>
  )
}

export default ResumePreview