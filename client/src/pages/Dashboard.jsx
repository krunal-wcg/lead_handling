import React from "react";
import TimeChart from "../charts/TimeChart";
import { decodedToken } from "../healpers/getDecodedToken";

const Dashboard = () => {
  return (
    <section className="lg:ml-60 max-lg::m-2 text-gray-600 body-font">
      <div className=" px-2 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          {decodedToken()?.user?.role ? <TimeChart /> : "Dashboard"}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
