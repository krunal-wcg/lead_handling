import React from 'react'
import SignUpForm from '../forms/SignUpForm'

const SignUp = () => {
    return (
        <section className="bg-[#141E30] bg-gradient-to-r from-[#243B55] to-[#141E30]">
            <div className="h-screen w-screen bg-opacity-50 flex items-center justify-center ">
                <div className="select-none lg:p-10 max-lg:p-5 max-lg:m-1 lg:w-1/3 bg-gradient-to-r from-[aliceblue] to-[powderblue] text-[black] rounded">
                    <h1 className="text-3xl flex font-medium text-wcg_blue">Beginning!</h1>

                    <div className="pt-10 max-lg:mt-10">
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignUp