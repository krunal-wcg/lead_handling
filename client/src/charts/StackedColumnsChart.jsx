import React from "react";
import ReactApexChart from "react-apexcharts";

const StackedColumnsChart = ({ data }) => {
  // Extracting unique usernames
  const usernames = Array.from(
    new Set(data.flatMap((lead) => lead.lead.map((user) => user.userName)))
  );

  // Creating series data for each lead
  const series = data.map((lead) => ({
    name: lead.leadName,
    data: usernames.map((username) => {
      const user = lead.lead.find((u) => u.userName === username);
      return user ? user.totalSpentTime : 0;
    }),
  }));

  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },

      selection: {
        enabled: true,
        type: "x",
        fill: {
          color: "#24292e",
          opacity: 0.1,
        },
      },
      stroke: {
        width: 1,
        dashArray: 3,
        color: "#24292e",
        opacity: 0.4,
      },
      zoom: {
        enabled: true,
        type: "xy",
        autoScaleYaxis: true,
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.4,
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.4,
            width: 1,
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: usernames,
      group: {
        groups: [],
        style: {
          colors: [],
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: undefined,
          cssClass: "",
        },
      },
    },
    yaxis: {
      title: {
        text: "Time Spent (in seconds)",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " seconds";
        },
      },
    },

    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      offsetY: 10,
    },
    tickPlacement: "on",
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height={400} />
  );
};

export default StackedColumnsChart;
