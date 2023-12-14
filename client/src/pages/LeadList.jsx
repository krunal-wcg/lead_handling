/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FcRemoveImage } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaCodePullRequest,
  FaRegCircleXmark,
  FaUserClock,
  FaUserPen,
  FaUserXmark,
} from "react-icons/fa6";
import Tooltip from "../common/Tooltip";
import EditForm from "../forms/EditForm";
import { decodedToken } from "../healpers/getDecodedToken";
import { socket } from "../healpers/socket";
import { Api } from "../utils/api";
import { getSuccessToast } from "../common/Toaster/toaster";

const LeadList = () => {
  const [userId, setUserId] = useState("111");
  const [leads, setLeads] = useState({});
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(!1);
  const [data, setData] = useState([]);
  const [currentLead, setCurrentLead] = useState("");
  var token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  useEffect(() => {
    token = decodedToken();
    setUserId(token?.user?.id);
    setUsername(token?.user?.username);
    setRole(token?.user?.role);
  }, []);

  useEffect(() => {
    const updatedLeads = {};
    data.forEach((el) => {
      updatedLeads[el?._id] = { user: null }; // Assuming each element has a unique identifier like 'id'
    });

    setLeads(updatedLeads);
  }, [data]);

  const nav = useNavigate();



  const openLead = (leadId, senderID) => {
    setOpen(true);
    socket.emit("openLead", leadId, senderID, username);
    setCurrentLead(leadId);
  };

  const closeLead = (leadId, closerID) => {
    setOpen(false);
    socket.emit("closeLead", leadId, closerID);
  };
  const sendAlert = (targetUserId, sendleadId, senderId) => {
    socket.emit("sendAlertToUser", targetUserId, sendleadId, senderId);
  };
  async function fetchData() {
    // You can await here
    await Api.get(`/leads`)
      .then((response) => {
        setLoading(!1);
        setData(response?.data?.leads);
      })
      .catch((err) => {
        console.log(err.response.data);
        nav("/dashboard");
      });
  }
  useEffect(() => {
    setLoading(!0);

    leads && fetchData();
  }, [open]);

  useEffect(() => {
    // Request initial leads data when component mounts
    socket.emit("requestInitialData");

    socket.on("initialData", (initialLeads) => {
      setLeads(initialLeads);
    });
    return () => {
      socket.off("initialData");
    };
  }, [data]);

  useEffect(() => {
    socket.on("leadOpened", ({ leadId, userId }) => {
      setLeads((prevLeads) => ({
        ...prevLeads,
        [leadId]: { user: userId, username: username },
      }));
    });

    socket.on("leadClosed", (leadId) => {
      setLeads((prevLeads) => ({
        ...prevLeads,
        [leadId]: { user: null },
      }));
    });

    socket.on("invalidLead", (message) => {
      console.log(`Error: ${message}`);
    });

    socket.on("leadAlreadyOpened", (message) => {
      console.log(`Error: ${message}`);
    });

    socket.on("updateLeads", (updatedLeads) => {
      setLeads(updatedLeads);
    });

    socket.on(
      "receiveAlert",
      ({
        targetUserId,
        leadId,
        senderId,
        title,
        text,
        icon,
        confirmButtonText,
      }) => {
        targetUserId === userId &&
          Swal.fire({
            title,
            text,
            icon,
            confirmButtonText,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,

            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `
             no
            `,
            cancelButtonAriaLabel: "Thumbs down",
          }).then((res) => {
            if (res.isConfirmed) {
              closeLead(leadId, targetUserId);
              socket.emit("alertConfirmed", targetUserId, leadId, senderId);
            } else {
            }
          });
      }
    );
    socket.on(
      "confirmAlert",
      ({
        confirmId,
        leadId,
        alertId,
        title,
        text,
        icon,
        confirmButtonText,
      }) => {
        alertId === userId &&
          Swal.fire({
            title,
            text,
            icon,
            confirmButtonText,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,

            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `no`,
            cancelButtonAriaLabel: "Thumbs down",
          }).then((res) => {
            if (res.isConfirmed) {
              openLead(leadId, alertId);
            } else {
            }
          });
      }
    );

    // let leadIdBeingClosed = null; // To track the lead being closed for displaying time

    socket.on("leadTimerUpdate", ({ leadId, elapsedTime }) => {
      // Update the UI with the elapsed time during the lead being open
      // Optionally, you can display this in real-time on the UI
    });

    socket.on("leadTimerClosed", async ({ userId, leadId, elapsedTime }) => {
      const time = Math.floor(elapsedTime / 1000);

      const Payload = {
        userId: userId,
        totalSpentTime: time,
      };
      await Api.put(`/leads/chart/${leadId}`, Payload).then((response) => {
        socket.emit("requestInitialChartData");
      });
    });

    return () => {
      socket.off("leadOpened");
      socket.off("leadClosed");
      socket.off("invalidLead");
      socket.off("leadAlreadyOpened");
      socket.off("userAlreadyHasLead");
      socket.off("updateLeads");
      socket.off("sendAlertToUser");
      socket.off("receiveAlert");
      socket.off("alertConfirmed");
      socket.off("leadTimerUpdate");
      socket.off("leadTimerClosed");
    };
  }, [userId]);

  const deleteLead = async (id) => {
    await Api.delete(`/leads/${id}`)
      .then((response) => {
        fetchData();
        getSuccessToast(response?.data?.message)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    data &&
    !loading && (
      <>
        <section className="lg:ml-60 max-lg:m-2 text-gray-600 body-font">
          <div className=" px-2 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                Lead List
              </h1>
              <p className="lg:w-5/6 mx-auto leading-relaxed text-base">
                List of the Leads
              </p>
            </div>

            <div className="lg:w-5/6 w-full mx-auto overflow-auto">
              {/*  */}
              <button
                onClick={() => setOpen(!open)}
                className="inline-block text-black bg-slate-200  py-2 my-3 px-6 focus:outline-none hover:bg-slate-300 border-b-cyan-500 border-b-2"
              >
                Add New Lead
              </button>
              <table className="table-auto w-full text-left whitespace-no-wrap">
                <thead>
                  <tr className="border-b-4 border-stone-700">
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                      name
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      email
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      role
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      city
                    </th>
                    {/* <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"> city</th> */}
                    <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                      country
                    </th>
                    <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                      phone no
                    </th>
                    <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                      score
                    </th>
                    <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br px-3">
                      action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((el) => (
                    <tr
                      key={el?._id}
                      className={`${leads[el?._id]?.user === userId
                        ? "bg-green-100"
                        : leads[el?._id]?.user
                          ? "bg-yellow-100"
                          : ""
                        } border-b-2 border-cyan-500 `}
                    >
                      <td className="px-4 py-3">{el?.name}</td>
                      <td className="px-4 py-3">{el?.email}</td>
                      <td className="px-4 py-3">{el?.role}</td>
                      <td className="px-4 py-3">{el?.city}</td>
                      <td className="px-4 py-3">{el?.country}</td>
                      <td className="px-4 py-3">{el?.phone}</td>
                      <td className="px-4 py-3">{el?.score}</td>

                      <td>
                        {leads[el?._id]?.user === userId && (
                          <FaRegCircleXmark
                            className="h-5 w-5 text-cyan-800 cursor-pointer mx-2  "
                            onClick={() => closeLead(el?._id, userId)}
                          />
                        )}
                        {leads[el?._id]?.user
                          ? leads[el?._id]?.user !== userId && (
                            <div className="flex">
                              {" "}
                              <Tooltip
                                message={` ${leads[el?._id].username}`}
                              >
                                <FaUserClock className="h-5 w-5 text-cyan-800 cursor-pointer mx-2  " />
                              </Tooltip>
                              {!Object.keys(leads).find(
                                (key) => leads[key].user === userId
                              ) &&
                                role && (
                                  <FaCodePullRequest
                                    className="h-5 w-5 text-green-800 cursor-pointer mx-2  "
                                    onClick={() =>
                                      sendAlert(
                                        leads[el?._id]?.user,
                                        el?._id,
                                        userId
                                      )
                                    }
                                  />
                                )}
                            </div>
                          )
                          : !Object.keys(leads).find(
                            (key) => leads[key].user === userId
                          ) && (
                            <div className="flex">
                              <FaUserPen
                                className="h-5 w-5 text-gray-800 cursor-pointer mx-2  "
                                onClick={() => openLead(el?._id, userId)}
                              />
                              {role && (
                                <FaUserXmark
                                  className="h-5 w-5 text-red-500 cursor-pointer mx-2 "
                                  onClick={() => deleteLead(el._id)}
                                />
                              )}
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* <!-- drawer component --> */}
        <EditForm
          open={open}
          setOpen={setOpen}
          currentLead={currentLead}
          setCurrentLead={setCurrentLead}
        />
      </>
    )
  );
};

export default LeadList;
