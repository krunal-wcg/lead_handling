"use client";

import { useEffect, useState } from "react";
import { Avatar } from "./avatar";
import { decodedToken } from "../healpers/getDecodedToken";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import Tooltip from "./Tooltip";

export default function Byline({ className }) {
  const [name, setName] = useState("");
  const nav = useNavigate()


  function logout() {
    localStorage.clear()
    nav("/signin")
  }

  useEffect(() => {
    let token = decodedToken();
    setName(token?.user?.username);
  }, []);

  return (
    name && (
      <div
        className={`${className} text-black  inset-x-0 bottom-3 mx-3 rounded-lg p-px hover:bg-blue-900`}
      >
        <div className="flex justify-between space-y-2 rounded-lg bg-blue-500/50 lg:px-5 lg:py-3">
          <div className="flex justify-between space-y-2">
            <Avatar
              name={name}
              className={
                "h-10 w-10 rounded-full pl-2 pt-1 text-lg mr-2 text-white"
              }
            />
            <h2 className="text-gray-50 title-font font-medium">{name}</h2>
          </div>
          <Tooltip message={"Sign Out"}>
            <FaArrowRightToBracket onClick={() => logout()} className="justify-self-end w-6 h-6 cursor-pointer text-[aliceblue] hover:text-gray-600" />
          </Tooltip>
        </div>
      </div>
    )
  );
}
