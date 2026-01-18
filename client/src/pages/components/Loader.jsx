// components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      {/* 像素小鸭子（MotherDuck 风格） */}
      <div className="relative mb-6">
        {/* 身体 - 黄色圆角像素块 */}
        <div className="w-24 h-20 bg-yellow-300 rounded-xl relative">
     
          <div className="absolute top-3 left-4 w-4 h-4 bg-white rounded-full">
            <div className="w-2 h-2 bg-black rounded-full mt-1 ml-1 animate-blink"></div>
          </div>
          <div className="absolute top-3 right-4 w-4 h-4 bg-white rounded-full">
            <div className="w-2 h-2 bg-black rounded-full mt-1 ml-1 animate-blink"></div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 
                          border-l-4 border-r-4 border-t-6 border-transparent border-t-orange-400"></div>

        
          <div className="absolute -top-1 left-2 w-6 h-4 bg-yellow-400 rounded-full rotate-12"></div>
        </div>

    
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      </div>



      <div className="mt-4 w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>


      <style jsx>{`
        @keyframes blink {
          0%, 90% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;