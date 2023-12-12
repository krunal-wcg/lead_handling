import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
const EditForm = ({ open, setOpen }) => {
  const [editedPerson, setEditedPerson] = useState({
    name: "",
    email: "",
    role: "",
    city: "",
    country: "",
    phone: "",
    score: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("submit===>", editedPerson);
    setOpen(false);
  };
  return (
    <div>
      <div
        id="drawer-right-example"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto bg-white w-[33rem] dark:bg-gray-800 ${open === false ? "transition-transform translate-x-full" : ""
          }`}
      // tabindex="-1"
      // aria-labelledby="drawer-right-label"
      >
        <h5
          id="drawer-right-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            className="w-4 h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          Right drawer
        </h5>
        <button
          type="button"
          // data-drawer-hide="drawer-right-example"
          // aria-controls="drawer-right-example"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            setOpen(false);
          }}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Person</h2>
          <Formik
            initialValues={{
              name: "",
              email: "",
              role: "",
              city: "",
              country: "",
              phone: 0,
              score: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .max(15, "Must be 15 characters or less")
                .required("Required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              role: Yup.string().required("Required"),
              city: Yup.string().required("Required"),
              country: Yup.string().required("Required"),
              phone: Yup.number().nullable(true).required("Required"),
              score: Yup.number().nullable(true).required("Required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("name")}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    email:
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("email")}
                    // onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div>{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    role:
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("role")}
                    // onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.role && formik.errors.role ? (
                    <div>{formik.errors.role}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    city:
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("city")}
                    // onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.city && formik.errors.city ? (
                    <div>{formik.errors.city}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    country:
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("country")}
                    // onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.country && formik.errors.country ? (
                    <div>{formik.errors.country}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    phone:
                  </label>
                  <input
                    type="number"
                    {...formik.getFieldProps("phone")}
                    // onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div>{formik.errors.phone}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    score:
                  </label>
                  <input
                    type="number"
                    {...formik.getFieldProps("score")}
                    // onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {formik.touched.score && formik.errors.score ? (
                    <div>{formik.errors.score}</div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditForm;