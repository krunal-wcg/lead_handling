import React, { useEffect, useState } from "react";
import {
  FcCompactCamera,
  FcEditImage,
  FcExternal,
  FcRemoveImage,
} from "react-icons/fc";
import { io } from "socket.io-client";
import { data } from "./data";
import { useNavigate } from "react-router-dom";
import Tooltip from "./common/Tooltip";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import EditForm from "./EditForm";
const socket = io(process.env.PORT_URL);

const List = () => {
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
    // navigate(`/list/${leadId}`);
    setOpen(true);
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
    socket.on(
      "receiveAlert",
      ({ userId: id, title, text, icon, confirmButtonText }) => {
        id === userId &&
          Swal.fire({
            title,
            text,
            icon,
            confirmButtonText,
          });
      }
    );
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

  const [open, setOpen] = useState(false);

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
    console.log("submit===>",editedPerson);
    setOpen(false)
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className=" px-2 py-24 mx-auto">
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
                    } border-b-2 border-cyan-500 `}
                  >
                    <td className="px-4 py-3">{el.name}</td>
                    <td className="px-4 py-3">{el.email}</td>
                    <td className="px-4 py-3">{el.role}</td>
                    <td className="px-4 py-3">{el.city}</td>
                    <td className="px-4 py-3">{el.country}</td>
                    <td className="px-4 py-3">{el.phone}</td>
                    <td className="px-4 py-3">{el.score}</td>

                    <td>
                      {leads[el.id]?.user === userId && (
                        <button onClick={() => closeLead(el.id)}>
                          <FcRemoveImage />
                        </button>
                      )}
                      {leads[el.id]?.user
                        ? leads[el.id]?.user != userId && (
                            <div className="flex">
                              {" "}
                              <Tooltip message={` ${leads[el.id].user}`}>
                                <button
                                  data-tooltip-target="tooltip-default"
                                  type="button"
                                >
                                  <FcCompactCamera />
                                </button>
                              </Tooltip>
                              <button
                                onClick={() => sendAlert(leads[el.id]?.user)}
                              >
                                <FcExternal />
                              </button>
                            </div>
                          )
                        : !Object.keys(leads).find(
                            (key) => leads[key].user === userId
                          ) && (
                            <button onClick={() => openLead(el.id)}>
                              <FcEditImage />{" "}
                            </button>
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
      <EditForm open={open} setOpen={setOpen}/>
    </>
  );
};

export default List;
