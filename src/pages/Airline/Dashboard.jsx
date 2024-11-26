import { useEffect, useState } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import StatsCard from "../../components/StatsCard";
import axiosInstance from "../../config/axiosInstance";
import { Plane, Ticket, Route } from "lucide-react";

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

  return (
    <AirlineLayout>
      <h2 className="text-xl font-bold mb-4">
        Welcome to the Airline Authority Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Aircraft"
          value={stats.totalAircraft}
          icon={
            <i className="fas fa-plane">
              <Plane />
            </i>
          } // Replace with your preferred icon
          bgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={
            <i className="fas fa-ticket-alt">
              <Ticket />
            </i>
          } // Replace with your preferred icon
          bgColor="bg-green-100"
        />
        <StatsCard
          title="Total Trips"
          value={stats.totalTrips}
          icon={
            <i className="fas fa-route">
              <Route />
            </i>
          } // Replace with your preferred icon
          bgColor="bg-yellow-100"
        />
      </div>
    </AirlineLayout>
  );
};

export default Dashboard;
