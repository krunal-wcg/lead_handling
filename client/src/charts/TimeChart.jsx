import React, { useEffect, useState } from "react";
import StackedColumnsChart from "./StackedColumnsChart";
import axios from "axios";

function TimeChart() {
  const [loading, setLoading] = useState(!1);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(!0);
    async function fetchData() {
      // You can await here
      await axios
        .get(`http://192.168.1.107:9000/api/leads/chart/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setLoading(!1);
          setData(response?.data?.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }

    fetchData();
  }, []);
  console.log(data);

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