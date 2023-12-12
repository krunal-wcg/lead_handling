import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import EditForm from "../forms/EditForm";

const UsersList = () => {
  const [loading, setLoading] = useState(!1);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const nav = useNavigate()

  useEffect(() => {
    setLoading(!0);
    async function fetchData() {
      // You can await here
      await axios.get(`http://192.168.1.107:9000/api/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
        setLoading(!1);
        setData(response?.data?.users);
      }).catch(err => {
        console.log(err.response.data)
        nav("/dashboard")
      });
    }

    fetchData();
  }, []);

  return data && !loading && (
    <>
      <section className="lg:ml-60 max-lg:m-2 text-gray-600 body-font">
        <div className=" px-2 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
              User List
            </h1>
            <p className="lg:w-5/6 mx-auto leading-relaxed text-base">
              List of the Users
            </p>
          </div>
          <div className="lg:w-5/6 w-full mx-auto overflow-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr className="border-b-4 border-stone-700">
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                    name
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    username
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    email
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    createdAt
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                    updatedAt
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((el) => (
                  <tr
                    key={el?._id}
                    className={`bg-yellow-100 border-b-2 border-cyan-500`}
                  >
                    <td className="px-4 py-3">{el?.name || "-"}</td>
                    <td className="px-4 py-3">{el?.username}</td>
                    <td className="px-4 py-3">{el?.email}</td>
                    <td className="px-4 py-3">{new Date(el?.createdAt).toUTCString()}</td>
                    <td className="px-4 py-3">{new Date(el?.updatedAt).toUTCString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* <!-- drawer component --> */}
      <EditForm open={open} setOpen={setOpen} />
    </>
  );
};

export default UsersList;
