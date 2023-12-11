import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#243B55] to-[#141E30] flex items-center justify-center ">
      <Link className='p-2 bg-slate-400 rounded cursor-pointer hover:text-gray-800' to="/list">Leads</Link>
    </div>
  )
}

export default Home


