import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import List from './List'
import Detail from './Detail'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

const Router = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/list"  >
                    <Route index element={<List />} />
                    <Route path=':id' element={<Detail />} />
                </Route>


            </Routes>

        </div>)
}

export default Router