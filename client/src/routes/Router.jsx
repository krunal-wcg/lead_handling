import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home'
import LeadList from '../pages/LeadList'
import NotFound from '../pages/NotFound'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/list"  >
                <Route index element={<LeadList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Router