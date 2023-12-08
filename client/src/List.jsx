import React, { useEffect, useState } from "react";
import { FcCompactCamera, FcEditImage, FcRemoveImage } from "react-icons/fc";
import { io } from "socket.io-client";
import { data } from "./data";
import { useNavigate } from "react-router-dom";
import Tooltip from "./common/Tooltip";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'
const socket = io("http://192.168.1.76:3001");

const List = () => {
  console.log(data);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("111");
  const [leads, setLeads] = useState({});

  useEffect(() => {
    setUserId(localStorage.getItem("loggedUser"));
  }, []);

  useEffect(() => {
    // Assuming data is an array of elements
    const updatedLeads = {};
    data.forEach((el) => {
      updatedLeads[el.id] = { user: null }; // Assuming each element has a unique identifier like 'id'
    });

    setLeads(updatedLeads);
  }, [data]);

  const openLead = (leadId) => {
    navigate(`/list/${leadId}`);

    socket.emit("openLead", leadId, userId);
  };

  const closeLead = (leadId) => {
    socket.emit("closeLead", leadId, userId);
  };
  const sendAlert = (targetUserId) => {
    socket.emit("sendAlertToUser", targetUserId);
  };

  useEffect(() => {
    // Request initial leads data when component mounts
    socket.emit("requestInitialData");

    socket.on("initialData", (initialLeads) => {
      setLeads(initialLeads);
    });
    socket.on("leadOpened", ({ leadId, userId }) => {
      setLeads((prevLeads) => ({
        ...prevLeads,
        [leadId]: { user: userId },
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

    ////////////

    socket.on("sendAlert", () => {
      // Show SweetAlert when receiving the alert event
      Swal.fire({
        title: "SweetAlert Example",
        text: "This is a SweetAlert sent from the server!",
        icon: "success",
        confirmButtonText: "OK",
      });
    });
    socket.on("receiveAlert", ({userId:id, title, text, icon, confirmButtonText }) => {
      id===userId && Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
      });
    });
    return () => {
      socket.off("initialData");
      socket.off("leadOpened");
      socket.off("leadClosed");
      socket.off("invalidLead");
      socket.off("leadAlreadyOpened");
      socket.off("userAlreadyHasLead");
      socket.off("updateLeads");
      socket.off("sendAlertToUser");
      socket.off("receiveAlert");
    };
  }, [userId]);

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
              Lead List
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              {" "}
              List of the Leads
            </p>
          </div>
          <div className="lg:w-2/3 w-full mx-auto overflow-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                    name
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    age
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    gender
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    occupation
                  </th>
                  {/* <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"> city</th> */}
                  <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
                    action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((el) => (
                  <tr
                    key={el.id}
                    className={`${
                      leads[el.id]?.user === userId
                        ? "bg-green-100"
                        : leads[el.id]?.user
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3">{el.name}</td>
                    <td className="px-4 py-3">{el.age}</td>
                    <td className="px-4 py-3 text-lg text-gray-900">
                      {el.gender}
                    </td>
                    <td className="px-4 py-3">{el.occupation}</td>
                    {/* <td className="px-4 py-3">{el.city}</td> */}
                    <td>
                      {leads[el.id]?.user === userId && (
                        <button onClick={() => closeLead(el.id)}>
                          <FcRemoveImage />
                        </button>
                      )}
                      {leads[el.id]?.user
                        ? leads[el.id]?.user != userId && (
                            <Tooltip message={` ${leads[el.id].user}`}>
                              <button
                                data-tooltip-target="tooltip-default"
                                type="button"
                              >
                                <FcCompactCamera />
                                <button
                                  onClick={() => sendAlert(leads[el.id]?.user)}
                                >
                                  Send Alert
                                </button>
                              </button>
                            </Tooltip>
                          )
                        : !Object.keys(leads).find(
                            (key) => leads[key].user === userId
                          ) && (
                            <button onClick={() => openLead(el.id)}>
                              <FcEditImage />{" "}
                            </button>
                          )}
                      {/* {userId && (
                        <button
                          onClick={() => sendAlert("krunal")}
                          className="bg-green-500 text-white py-1 px-2 rounded ml-2"
                        >
                          Send Alert
                        </button>
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default List;
