/* eslint-disable react/prop-types */
const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 ${bgColor} rounded-full`}>{icon}</div>
      </div>
      <p className="text-green-500 text-sm mt-2">↑ Compared to last month</p>
    </div>
  );
};

export default StatsCard;
