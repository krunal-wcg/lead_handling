import React, { useState } from "react";

import { Form, Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Api } from "../utils/api";

// Creating schema
const schema = Yup.object({
  email: Yup.string().required("Email or Username required!!"),
  password: Yup.string().required("Password Can't be null!").max(10),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(!1);

  function validateEmail(value) {
    var re = /\S+@\S+\.\S+/;
    if (re.test(value)) {
      return { email: value };
    } else {
      return { username: value };
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            setLoading(!0);
            await Api.post(`/users/login`, { password: values?.password, ...validateEmail(values.email) }).then((response) => {
              navigate("/");
              localStorage.setItem("token", response?.data?.accessToken);
            });
          } catch (error) {
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
                <label htmlFor="email">
                  <div className="flex justify-between">
                    <span className="uppercase text-sm">Email or Username</span>
                    <span className="text-xs text-red-600">
                      {errors.email && touched.email && errors.email}
                    </span>
                  </div>
                  <input
                    placeholder={"Enter email or username"}
                    autoComplete="true"
                    type="text"
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
                      <span className="uppercase text-sm">Password</span>
                      <span className="text-xs text-red-600">
                        {errors.password && touched.password && errors.password}
                      </span>
                    </div>
                    <input
                      placeholder={"Enter your password"}
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

              <div className="select-none w-100 gap-2">
                <button
                  disabled={loading}
                  type="submit"
                  onSubmit={() => handleSubmit}
                  className="mb-5 select-none hover:text-white w-full transform border-none bg-cyan-950 rounded p-3 text-gray-400 transition duration-300 active:scale-95"
                >
                  <span> {loading ? "..." : "Sign In"}</span>
                </button>
                <span className="text-end text-sm font-extralight text-black">
                  <Link
                    to="/signup"
                    preventScrollReset={true}
                    className="select-none branded-link cursor-pointer
                    text-sm font-extralight text-cyan-950 hover:text-yellow-800"
                  >
                    Need an account?
                  </Link>
                </span>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
