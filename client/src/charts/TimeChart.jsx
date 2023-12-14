/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { socket } from "../healpers/socket";
import StackedColumnsChart from "./StackedColumnsChart";

function TimeChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.emit("timeSpentData");

    socket.on("timeRequest", (initData) => {
      setData(() => [...initData])
    });

    return () => {
      socket.off("timeRequest");
    };
  }, []);

  return (
    !!data.length && (
      <section className=" max-lg:m-2 text-gray-600 body-font">
        <div className="lg:w-3/5 px-2 py-24 mx-auto">
          <StackedColumnsChart data={data} />
        </div>
      </section>
    )
  );
}

export default TimeChart;
