/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import StatsCard from "../../components/StatsCard";
import axiosInstance from "../../config/axiosInstance";
import { Plane, Ticket, Route } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAircraft: 0,
    totalBookings: 0,
    totalTrips: 0,
  });
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/airline/stats");
        setStats(response.data.response);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    {
      name: "Total Aircraft",
      value: stats.totalAircraft,
      color: "#60A5FA", // Brighter blue
      icon: "✈️",
    },
    {
      name: "Total Bookings",
      value: stats.totalBookings,
      color: "#34D399", // Brighter green
      icon: "🎫",
    },
    {
      name: "Total Trips",
      value: stats.totalTrips,
      color: "#FBBF24", // Brighter yellow
      icon: "🛣️",
    },
  ];

  const handleMouseOver = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-lg font-semibold flex items-center gap-2">
            <span>{data.icon}</span>
            {label}
          </p>
          <p className="text-gray-600 mt-1">
            Count: <span className="font-semibold">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AirlineLayout>
      <div className="p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to the Airline Authority Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Aircraft"
            value={stats.totalAircraft}
            icon={<Plane className="w-8 h-8" />}
            bgColor="bg-blue-100"
          />
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Ticket className="w-8 h-8" />}
            bgColor="bg-green-100"
          />
          <StatsCard
            title="Total Trips"
            value={stats.totalTrips}
            icon={<Route className="w-8 h-8" />}
            bgColor="bg-yellow-100"
          />
        </div>

        {/* Enhanced Stats Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full mt-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Statistics Overview
            </h3>
            <p className="text-gray-500 mt-1">
              Visual representation of key metrics
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-gray-600">{value}</span>}
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Count"
                  radius={[4, 4, 0, 0]}
                  onMouseOver={handleMouseOver}
                  onMouseLeave={handleMouseLeave}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      fillOpacity={activeIndex === index ? 1 : 0.75}
                      stroke={entry.color}
                      strokeWidth={activeIndex === index ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AirlineLayout>
  );
};

export default Dashboard;