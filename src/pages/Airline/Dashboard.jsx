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
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAircraft: 0,
    totalBookings: 0,
    totalTrips: 0,
  });

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
      color: "#93C5FD",
    },
    {
      name: "Total Bookings",
      value: stats.totalBookings,
      color: "#86EFAC",
    },
    {
      name: "Total Trips",
      value: stats.totalTrips,
      color: "#FDE68A",
    },
  ];

  return (
    <AirlineLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
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

        {/* Stats Chart - Now integrated directly in Dashboard */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Statistics Overview</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#93C5FD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AirlineLayout>
  );
};

export default Dashboard;
