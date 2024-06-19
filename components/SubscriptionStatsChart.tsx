import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components with ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

interface Channel {
  totalSubscriptionOutflowRate: number;
}

interface SubscriptionStatsChartProps {
  handle1: string;
  handle2: string;
  channels1: Channel[];
  channels2: Channel[];
}

const getPriceCategory = (price: number) => {
  if (price <= 500) return "500";
  if (price <= 1000) return "1000";
  return "1500";
};

const SubscriptionStatsChart: React.FC<SubscriptionStatsChartProps> = ({
  handle1,
  handle2,
  channels1,
  channels2,
}) => {
  const priceCategories1 = channels1.reduce(
    (acc, channel) => {
      const price = Math.round(
        channel.totalSubscriptionOutflowRate / 380517503805.174
      );
      const category = getPriceCategory(price);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    { "500": 0, "1000": 0, "1500": 0 }
  );

  const priceCategories2 = channels2.reduce(
    (acc, channel) => {
      const price = Math.round(
        channel.totalSubscriptionOutflowRate / 380517503805.174
      );
      const category = getPriceCategory(price);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    { "500": 0, "1000": 0, "1500": 0 }
  );

  const data1 = {
    labels: [" 500 DEGENx", "1000 DEGENx", "1500 DEGENx"],
    datasets: [
      {
        label: `${handle1}'s Subscriptions`,
        data: [
          priceCategories1["500"],
          priceCategories1["1000"],
          priceCategories1["1500"],
        ],
        backgroundColor: [
          "rgba(4, 0, 245, 0.6)", // Blue
          "rgba(140, 251, 81, 0.6)", // Lime Green
          "rgba(255, 105, 180, 0.6)", // Hot Pink
        ],
        borderColor: [
          "rgba(4, 0, 245, 1)", // Blue
          "rgba(140, 251, 81, 1)", // Lime Green
          "rgba(255, 105, 180, 0.6)", // Hot Pink
        ],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: [" 500 DEGENx", "1000 DEGENx", "1500 DEGENx"],
    datasets: [
      {
        label: `${handle2}'s Subscriptions`,
        data: [
          priceCategories2["500"],
          priceCategories2["1000"],
          priceCategories2["1500"],
        ],
        backgroundColor: [
          "rgba(4, 0, 245, 0.6)", // Blue
          "rgba(140, 251, 81, 0.6)", // Lime Green
          "rgba(255, 105, 180, 0.6)", // Hot Pink
        ],
        borderColor: [
          "rgba(4, 0, 245, 1)", // Blue
          "rgba(140, 251, 81, 1)", // Lime Green
          "rgba(255, 105, 180, 0.6)", // Hot Pink
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
      <div className="mb-4 uppercase text-xs text-gray-400">
        Subscription Breakdown{" "}
      </div>
      <div className="flex justify-center gap-6">
        <div className="w-1/2">
          <h2 className="text-center uppercase text-xs mb-4">{handle1}</h2>
          <Pie data={data1} />
        </div>
        <div className="w-1/2">
          <h2 className="text-center uppercase text-xs mb-4">{handle2}</h2>
          <Pie data={data2} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatsChart;
