import {
  User,
  Book,
  Shield,
  Wallet,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { title: "Personal", icon: User, section: "personal" },
  { title: "Bookings", icon: Book, section: "bookings" },
  { title: "Security", icon: Shield, section: "security" },
  { title: "Wallet", icon: Wallet, section: "wallet" },
  { title: "Travellers", icon: Users, section: "travellers" },
  { title: "Chats", icon: MessageSquare, section: "chats" },
];

// Wrapper component for consistent positioning
const SidebarWrapper = ({ children }) => (
  <div className="left-4 mt-32 ml-10 h-auto">
    {children}
  </div>
);

// Modern Gradient Sidebar
const ModernGradientSidebar = ({
  activeSection,
  setActiveSection,
  handleLogout,
}) => (
  <SidebarWrapper>
    <nav className="fixed w-60 bg-gradient-to-t from-sky-500 to-blue-500 text-white rounded-lg shadow-lg">
      {" "}
      {/* Changed w-48 to w-64 */}
      <ul className="py-2">
        {sidebarItems.map((item) => (
          <li key={item.section}>
            <button
              onClick={() => setActiveSection(item.section)}
              className={`flex items-center w-full px-4 py-2 text-sm transition-all duration-200 
              ${
                activeSection === item.section
                  ? "bg-white bg-opacity-20 border-l-4 border-white"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <item.icon size={16} />
              <span className="ml-2 font-bold">{item.title}</span>
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm transition-all duration-200 hover:bg-white hover:bg-opacity-10"
          >
            <LogOut size={16} />
            <span className="ml-2 font-bold">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  </SidebarWrapper>
);

export { ModernGradientSidebar };
