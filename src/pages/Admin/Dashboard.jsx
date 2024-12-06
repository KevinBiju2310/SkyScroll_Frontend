import { AdminLayout } from "../../components/AdminLayout";
import { Plane, Users, Building2, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import StatsCard from "../../components/StatsCard";
import axiosInstance from "../../config/axiosInstance";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAirlines: 0,
    totalUsers: 0,
    totalAirports: 0,
    totalRevenue: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard");
        const {
          totalUsers,
          totalAirlines,
          totalAirports,
          totalRevenue,
          monthlyData,
        } = response.data.response;
        setStats({
          totalUsers,
          totalAirlines,
          totalAirports,
          totalRevenue,
        });
        setMonthlyData(fillMissingMonths(monthlyData));
      } catch (error) {
        console.error("Error occured: ", error);
      }
    };
    fetchStats();
  }, []);

  const fillMissingMonths = (data) => {
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      year: 2024,
      revenue: 0,
      userCount: 0,
      airlineCount: 0,
      airportCount: 0,
    }));

    data.forEach((entry) => {
      const index = allMonths.findIndex(
        (item) => item.month === entry.month && item.year === entry.year
      );
      if (index !== -1) {
        allMonths[index] = { ...allMonths[index], ...entry };
      }
    });

    return allMonths.map((item) => ({
      ...item,
      month: `${formatMonth(item.month)} ${item.year}`,
    }));
  };

  // Format month name for display
  const formatMonth = (month) => {
    const date = new Date(2024, month - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  // Prepare data for growth overview
  const growthData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Airlines", value: stats.totalAirlines },
    { name: "Airports", value: stats.totalAirports },
  ];

  // console.log(monthlyData);
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <h1 className="font-bold text-xl">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Airlines"
            value={stats.totalAirlines}
            icon={<Plane className="w-6 h-6 text-blue-600" />}
            bgColor="bg-blue-100"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<Users className="w-6 h-6 text-purple-600" />}
            bgColor="bg-purple-100"
          />
          <StatsCard
            title="Total Airports"
            value={stats.totalAirports}
            icon={<Building2 className="w-6 h-6 text-orange-600" />}
            bgColor="bg-orange-100"
          />
          <StatsCard
            title="Total Revenue"
            value={`INR ${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            bgColor="bg-green-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Line Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Overview Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Growth Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              {
                action: "New airline registered",
                time: "2 hours ago",
                highlight: "Emirates Airways",
              },
              {
                action: "Airport added",
                time: "5 hours ago",
                highlight: "JFK International",
              },
              {
                action: "New users joined",
                time: "1 day ago",
                highlight: "156 users",
              },
              {
                action: "Revenue milestone",
                time: "2 days ago",
                highlight: "$40,000 achieved",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="text-gray-800">{item.action}</p>
                  <p className="text-sm text-blue-600 font-medium">
                    {item.highlight}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
