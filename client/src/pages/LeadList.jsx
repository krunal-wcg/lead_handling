import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import {
    FcCompactCamera,
    FcEditImage,
    FcExternal,
    FcRemoveImage,
} from "react-icons/fc";

import Tooltip from "../common/Tooltip";
import { data } from "../data/data";
import EditForm from "../forms/EditForm";
import { decodedToken } from "../healpers/getDecodedToken";


const socket = io("http://192.168.1.76:9000");

const LeadList = () => {
    const [userId, setUserId] = useState("111");
    const [leads, setLeads] = useState({});

    useEffect(() => {
        var token = decodedToken()
        setUserId(token?.user?.username);
    }, []);

    useEffect(() => {
        // Assuming data is an array of elements
        const updatedLeads = {};
        data.forEach((el) => {
            updatedLeads[el.id] = { user: null }; // Assuming each element has a unique identifier like 'id'
        });

        setLeads(updatedLeads);
    }, [data]);

    const openLead = (leadId, senderID) => {
        setOpen(true);
        socket.emit("openLead", leadId, senderID);
    };

    const closeLead = (leadId, closerID) => {
        setOpen(false);
        socket.emit("closeLead", leadId, closerID);
    };
    const sendAlert = (targetUserId, sendleadId, senderId) => {
        socket.emit("sendAlertToUser", targetUserId, sendleadId, senderId);
        console.log(targetUserId, sendleadId, senderId);
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


        socket.on(
            "receiveAlert",
            ({ targetUserId, leadId, senderId, title, text, icon, confirmButtonText }) => {
                console.log("receiveAlert", targetUserId, leadId, senderId);
                targetUserId === userId &&
                    Swal.fire({
                        title, text, icon, confirmButtonText,
                        showCloseButton: true,
                        showCancelButton: true,
                        focusConfirm: false,

                        confirmButtonAriaLabel: "Thumbs up, great!",
                        cancelButtonText: `
             no
            `,
                        cancelButtonAriaLabel: "Thumbs down"
                    }).then((res) => {
                        if (res.isConfirmed) {
                            closeLead(leadId, targetUserId)
                            socket.emit("alertConfirmed", targetUserId, leadId, senderId);
                        } else {

                        }
                    })
            }
        );
        socket.on("confirmAlert",
            ({ confirmId, leadId, alertId, title, text, icon, confirmButtonText }) => {
                console.log("confirmAlert", { confirmId, leadId, alertId });
                alertId === userId &&
                    Swal.fire({

                        title, text, icon, confirmButtonText,
                        showCloseButton: true,
                        showCancelButton: true,
                        focusConfirm: false,

                        confirmButtonAriaLabel: "Thumbs up, great!",
                        cancelButtonText: `no`,
                        cancelButtonAriaLabel: "Thumbs down"
                    }).then((res) => {
                        if (res.isConfirmed) {
                            openLead(leadId, alertId)
                        } else {

                        }
                    })
            }
        )


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
            socket.off("alertConfirmed")
        };
    }, [userId]);

    const [open, setOpen] = useState(false);

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
                                        className={`${leads[el.id]?.user === userId
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
                                                <button onClick={() => closeLead(el.id, userId)}>
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
                                                            onClick={() => sendAlert(leads[el.id]?.user, el.id, userId)}
                                                        >
                                                            <FcExternal />
                                                        </button>
                                                    </div>
                                                )
                                                : !Object.keys(leads).find(
                                                    (key) => leads[key].user === userId
                                                ) && (
                                                    <button onClick={() => openLead(el.id, userId)}>
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
            <EditForm open={open} setOpen={setOpen} />
        </>
    );
};

export default LeadList;
