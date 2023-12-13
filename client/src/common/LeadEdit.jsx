import React, { useEffect, useState } from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { socket } from '../healpers/socket';
import { decodedToken } from '../healpers/getDecodedToken';
const LeadEdit = ({currentLead ,setOpen}) => {
    const [currentData, setCurrentData] = useState({});

    useEffect(() => {
      async function fetchData() {
        // You can await here
        await axios
          .get(`http://192.168.1.107:9000/api/leads/${currentLead}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then((response) => {
            setCurrentData(response?.data?.data);
          });
      }
  
      fetchData();
    }, [currentLead]);
  return (
    <Formik
    enableReinitialize
      initialValues={{
        name: currentData?.name || "",
        email: currentData?.email || "",
        role: currentData?.role || "",
        city: currentData?.city || "",
        country: currentData?.country || "",
        phone: currentData?.phone || "",
        score: currentData?.score || "",
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
      onSubmit={ async(values) => {
     
        await axios
        .put(`http://192.168.1.107:9000/api/leads/${currentLead}`,values ,{
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         
        })
        .then((response) => {
          setOpen(false)
          socket.emit("closeLead", currentLead, decodedToken().user?.id);
        });
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
              // value={formik.values?.name}
              // id="name"
              // name="name"
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
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      )}
    </Formik>
  )
}

export default LeadEdit