"use client";

import React from "react";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
}

interface SubscriptionStatsProps {
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

const calculateTotalCost = (channels: Channel[]) => {
  return channels.reduce((acc, channel) => {
    const price = Math.round(
      channel.totalSubscriptionOutflowRate / 380517503805.174
    );
    return acc + price;
  }, 0);
};

const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({
  handle1,
  handle2,
  channels1,
  channels2,
}) => {
  const totalCount1 = channels1.length;
  const totalCount2 = channels2.length;
  const totalCost1 = calculateTotalCost(channels1);
  const totalCost2 = calculateTotalCost(channels2);

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

  const getHighlightedClass = (count1: number, count2: number) => {
    if (count1 > count2) {
      return "text-secondary";
    }
    return "";
  };

  return (
    <div className="p-4 rounded-lg shadow-md mb-6 hidden md:block  border border-gray-700 text-white bg-gray-700 bg-opacity-10">
      <h2 className="uppercase text-center mb-4">Subscription Breakdown</h2>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Price (DEGENx)</th>
            <th className="px-4 py-2">{handle1}</th>
            <th className="px-4 py-2">{handle2}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">500</td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                priceCategories1["500"],
                priceCategories2["500"]
              )}`}
            >
              {priceCategories1["500"]}
            </td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                priceCategories2["500"],
                priceCategories1["500"]
              )}`}
            >
              {priceCategories2["500"]}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">1000</td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                priceCategories1["1000"],
                priceCategories2["1000"]
              )}`}
            >
              {priceCategories1["1000"]}
            </td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                priceCategories2["1000"],
                priceCategories1["1000"]
              )}`}
            >
              {priceCategories2["1000"]}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">1500</td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                priceCategories1["1500"],
                priceCategories2["1500"]
              )}`}
            >
              {priceCategories1["1500"]}
            </td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                priceCategories2["1500"],
                priceCategories1["1500"]
              )}`}
            >
              {priceCategories2["1500"]}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Total Subscriptions</td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                totalCount1,
                totalCount2
              )}`}
            >
              {totalCount1}
            </td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                totalCount2,
                totalCount1
              )}`}
            >
              {totalCount2}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2">Total Cost</td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                totalCost1,
                totalCost2
              )}`}
            >
              {totalCost1}
            </td>
            <td
              className={`px-4 py-2 ${getHighlightedClass(
                totalCost2,
                totalCost1
              )}`}
            >
              {totalCost2}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionStats;
