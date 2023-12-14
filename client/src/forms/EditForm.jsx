import React from "react";

import LeadEdit from "../common/LeadEdit";
import { socket } from "../healpers/socket";
import { decodedToken } from "../healpers/getDecodedToken";
import { FaX } from "react-icons/fa6";

const EditForm = ({ open, setOpen, currentLead, setCurrentLead }) => {
  return (
    <div>
      <div
        id="drawer-right-example"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto bg-white w-[33rem] dark:bg-gray-800 ${open === false ? "transition-transform translate-x-full" : ""
          }`}
      >
        <FaX className="text-gray-400 cursor-pointer rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center"
          onClick={() => {
            setOpen(false);
            setCurrentLead("");
            socket.emit("closeLead", currentLead, decodedToken().user?.id);
          }}
        />
        <span className="sr-only">Close menu</span>
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Person</h2>
          <LeadEdit currentLead={currentLead} setOpen={setOpen} setCurrentLead={setCurrentLead} />
        </div>
      </div>
    </div>
  );
};

export default EditForm;