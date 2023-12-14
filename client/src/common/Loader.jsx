import React from "react";

const Loader = () => {
  return (
    <section className="lg:ml-60 max-lg:m-2 text-gray-600 body-font">
      <div className="flex justify-center content-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          height={100}
          width={100}
        >
          <circle
            fill="none"
            stroke="teal"
            strokeWidth="4"
            strokeMiterlimit="10"
            cx="50"
            cy="50"
            r="48"
          />
          <line
            fill="none"
            strokeLinecap="round"
            stroke="blue"
            strokeWidth="4"
            strokeMiterlimit="10"
            x1="50"
            y1="50"
            x2="85"
            y2="50.5"
          >
            <animateTransform
              attributeName="transform"
              dur="2s"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            />
          </line>
          <line
            fill="none"
            strokeLinecap="round"
            stroke="orange"
            strokeWidth="4"
            strokeMiterlimit="10"
            x1="50"
            y1="50"
            x2="49.5"
            y2="74"
          >
            <animateTransform
              attributeName="transform"
              dur="15s"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            />
          </line>
        </svg>
      </div>
    </section>
  );
};

export default Loader;
