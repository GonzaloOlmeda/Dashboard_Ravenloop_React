import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { menuItems } from '../sidebar_data';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
        <motion.div 
        initial={{width: 80}}
        animate={{width: isOpen ? 240 : 80}}
        transition={{duration: 0.4}}
        className='bg-gray-900 h-screen text-white p-4 flex flex-col justify-between '>

            <div>
                <div className='mb-8 flex items-center justify-center mt-8'>
                    {isOpen ? (
                        <img src="/images/logo.png" alt="Ravenloop" className='w-full max-w-[180px] h-auto' />
                    ) : (
                        <img src="/images/logo.png" alt="Ravenloop" className='w-12 h-12 object-contain' />
                    )}
                </div>

                <nav>
                    {menuItems.map((item, index) => (
                        <div key={index} className='flex items-center gap-4 mt-4 cursor-pointer hover:bg-blue-500 p-2 rounded'>
                            {item.icon} 
                            {isOpen && <span>{item.text}</span>}
                        </div>
                    ))}
                </nav>
            </div>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className='w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center hover:bg-blue-200   /10 transition-colors'>
                {isOpen ? <FaArrowLeft className='text-blue-500' /> : <FaArrowRight className='text-blue-500' />}
            </button>
        </motion.div>
    </div>
  )
}

export default Sidebar
