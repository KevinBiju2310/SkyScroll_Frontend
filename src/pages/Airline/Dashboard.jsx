import AirlineLayout from "../../components/AirlineSidebar";

const App = () => {
  return (
    <AirlineLayout>
      <h2 className="text-xl font-bold mb-4">
        Welcome to the Airline Authority Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Total Flights</h3>
          <p className="text-2xl">1,234</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Active Bookings</h3>
          <p className="text-2xl">567</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Available Aircraft</h3>
          <p className="text-2xl">89</p>
        </div>
      </div>
    </AirlineLayout>
  );
};

export default App;
