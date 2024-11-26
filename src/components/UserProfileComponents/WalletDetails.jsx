import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";

const WalletDetails = () => {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const response = await axiosInstance.get("/wallet");
        setWallet(response.data.response);
      } catch (error) {
        console.error("Error Occured", error);
      }
    };
    fetchWalletDetails();
  }, []);

  if (!wallet) {
    return <p className="mt-24 text-gray-700 text-lg">No wallet found.</p>;
  }

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="mt-16 mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">My Wallet</h2>
              <p className="text-blue-100 text-sm">View your wallet details</p>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-blue-100 text-sm mb-1">Available Balance</p>
              <p className="text-white text-3xl font-bold">
                ₹{wallet.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Transaction History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">#</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wallet.transactions.map((transaction, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${
                      transaction.transactionType.toLowerCase() === 'refund' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.transactionType.toLowerCase() === 'refund' ? '+' : '-'}
                      ₹{transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.transactionType.toLowerCase() === 'credit'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(transaction.transactionDate).toLocaleDateString("in")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;