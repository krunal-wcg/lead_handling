import React from "react";
import TimeChart from "../charts/TimeChart";

const Dashboard = () => {
  return (
    <section className="lg:ml-60 max-lg::m-2 text-gray-600 body-font">
    <div className=" px-2 py-24 mx-auto">
      <div className="flex flex-col text-center w-full mb-20">
        <TimeChart />
      </div>
    </div>
  </section>
  );
};

export default Dashboard;
