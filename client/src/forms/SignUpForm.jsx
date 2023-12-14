"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import * as Yup from "yup";
import { Api } from "../utils/api";

// Creating schema
const schema = Yup.object({
  username: Yup.string().required("Username must be required!!").max(15),
  email: Yup.string()
    .email("Invalid email format!")
    .required("Mail is required!!"),
  password: Yup.string().required("Password Can't be null!").max(10),
});

export default function SignUpForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!1);
  const [showPassword, setShowPassword] = useState(!1);

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            setLoading(!0);
            const response = await Api.post(`/users/register`, values)
            navigate("/signin");
            console.log("Sign up Success", response.data);
          } catch (error) {
            console.log("Sign up Failed", error.message);
            // toast.error(error.message);
          } finally {
            setLoading(!1);
          }
        }}
        validationSchema={schema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">
                  <div className="flex justify-between">
                    <span className="uppercase text-sm">
                      username
                    </span>
                    <span className="text-xs text-red-600">
                      {errors.username && touched.username && errors.username}
                    </span>
                  </div>
                  <input
                    placeholder={"Enter username here..."}
                    autoComplete="true"
                    type="text"
                    id="username"
                    name="username"
                    value={values.username}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`focus:ring-0 w-full border-none rounded bg-cyan-950 text-sm p-3 text-gray-100`}
                  />
                </label>
              </div>

              <div className="my-6">
                <label htmlFor="email">
                  <div className="flex justify-between">
                    <span className="uppercase text-sm">
                      Email
                    </span>
                    <span className="text-xs text-red-600">
                      {errors.email && touched.email && errors.email}
                    </span>
                  </div>
                  <input
                    placeholder={"Enter Email here..."}
                    autoComplete="true"
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`focus:ring-0 w-full border-none rounded bg-cyan-950 text-sm p-3 text-gray-100`}
                  />
                </label>
              </div>

              <div className="my-6">
                <div className="relative">
                  <label htmlFor="password">
                    <div className="flex justify-between">
                      <span className="uppercase text-sm">
                        Password
                      </span>
                      <span className="text-xs text-red-600">
                        {errors.password && touched.password && errors.password}
                      </span>
                    </div>
                    <input
                      placeholder={"Enter your pass here..."}
                      autoComplete="true"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={`focus:ring-0 w-full border-none rounded bg-cyan-950 text-sm p-3 text-gray-100`}
                    />
                  </label>
                  <span
                    className="absolute right-3 top-1/2 transform cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-cyan-50" />
                    ) : (
                      <FaEye className="h-5 w-5 text-cyan-50" />
                    )}
                  </span>
                </div>
              </div>

              <div className="w-100 gap-2">
                <button
                  onClick={() => handleSubmit}
                  className="mb-5 select-none hover:text-white w-full transform border-none bg-cyan-950 rounded p-3 text-gray-400 transition duration-300 active:scale-95"
                >
                  <span> {loading ? "..." : "Sign Up"}</span>
                </button>

                <span
                  tabIndex={-1}
                  onClick={() => {
                    navigate("/signin");
                  }}
                  className="select-none branded-link cursor-pointer hover:text-yellow-900 text-sm font-extralight"
                >
                  Already have an account?
                </span>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
