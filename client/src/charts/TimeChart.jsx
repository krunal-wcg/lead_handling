/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { socket } from "../healpers/socket";
import { Api } from "../utils/api";
import StackedColumnsChart from "./StackedColumnsChart";

function TimeChart() {
  const [loading, setLoading] = useState(!1);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(true);
  const nav = useNavigate()

  useEffect(() => {
    socket.on("getChart", () => {
      setChartData(!chartData);
    });

    return () => {
      socket.off("getChart");
    };
  }, [chartData]);

  useEffect(() => {
    setLoading(!0);
    async function fetchData() {
      // You can await here
      await Api.get(`/leads/chart/all`)
        .then((response) => {
          setLoading(!1);
          setData(response?.data?.data);
        })
        .catch((err) => {
          console.log(err.response.data);
          nav("/dashboard")
        });
    }
    fetchData();

  }, [chartData]);

  return (
    data &&
    !loading && (
      <section className=" max-lg:m-2 text-gray-600 body-font">
        <div className="lg:w-3/5 px-2 py-24 mx-auto">
          <StackedColumnsChart data={data} />
        </div>
      </section>
    )
  );
}

export default TimeChart;
