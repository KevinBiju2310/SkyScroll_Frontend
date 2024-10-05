import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ModernGradientSidebar} from '../components/ProfileSideBar';
import PersonalInformation from '../components/UserProfileComponents/PersonalInformation';
import MyBookings from '../components/UserProfileComponents/MyBookings';
import Security from '../components/UserProfileComponents/Security';
import WalletDetails from '../components/UserProfileComponents/WalletDetails';
import OtherTravellers from '../components/UserProfileComponents/OtherTravellers';
import Chats from '../components/UserProfileComponents/Chats';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
    {/* Header */}
    <Header />

    {/* Main Content */}
    <div className="flex flex-grow">
      {/* Sidebar */}
      <ModernGradientSidebar activeSection={activeSection} setActiveSection={setActiveSection} handleLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {activeSection === 'personal' && <PersonalInformation />}
        {activeSection === 'bookings' && <MyBookings />}
        {activeSection === 'security' && <Security />}
        {activeSection === 'wallet' && <WalletDetails />}
        {activeSection === 'travellers' && <OtherTravellers />}
        {activeSection === 'chats' && <Chats />}
      </main>
    </div>

    {/* Footer */}
    <Footer />
  </div>
  );
};

export default ProfilePage;
