import React from "react";

import LeadEdit from "../common/LeadEdit";
import { socket } from "../healpers/socket";
import { decodedToken } from "../healpers/getDecodedToken";
const EditForm = ({ open, setOpen, currentLead, setCurrentLead }) => {



  return (
    <div>
      <div
        id="drawer-right-example"
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto bg-white w-[33rem] dark:bg-gray-800 ${
          open === false ? "transition-transform translate-x-full" : ""
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
          { currentLead ? "Edit User":"Add user"}
        </h5>
        <button
          type="button"
          // data-drawer-hide="drawer-right-example"
          // aria-controls="drawer-right-example"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            setOpen(false);
            setCurrentLead("");
            socket.emit("closeLead", currentLead, decodedToken().user?.id);
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
         <LeadEdit currentLead={currentLead} setOpen={setOpen} setCurrentLead={setCurrentLead} />
        </div>
      </div>
    </div>
  );
};

export default EditForm;
