import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Plus,
  MessageSquare,
  Zap,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  CirclePower,
} from "lucide-react";
import DashboardContent from "@/components/myCommponents/DashboardContent";
import ChatWithAi from "@/components/myCommponents/ChatWithAi";
import CreateSocket from "@/components/myCommponents/CreateSocket";
import MonitorEnergy from "@/components/myCommponents/MonitorEnergy";
import SettingsTab from "@/components/myCommponents/SettingsTab";
import ControlDevices from "@/components/myCommponents/ControlDevices";
import useUserStore from "@/store/UserStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "control", name: "Control Devices", icon: CirclePower },
    { id: "monitor", name: "Monitor Energy", icon: Zap },
    { id: "create-socket", name: "Create New Socket", icon: Plus },
    { id: "chat-ai", name: "Chat with AI", icon: MessageSquare },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const { user, fetchUserData } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      fetchUserData();
    };

    loadUser();

    const interval = setInterval(loadUser, 1000);

    return () => clearInterval(interval);
  }, []);
  const handleMenuClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 top-0 z-50 w-64 bg-linear-to-b from-blue-900 to-indigo-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between p-4 border-b border-indigo-700">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg mr-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">WattBot</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-indigo-800"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-indigo-700">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user.username}
                </p>
                <p className="text-xs text-indigo-300">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-3 text-indigo-200 hover:text-white hover:bg-indigo-800 justify-start"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.success("You have been successfully logged out.");
                navigate("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user.username}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && <DashboardContent />}

          {/* Control Devices Tab */}
          {activeTab === "control" && <ControlDevices />}

          {/* Monitor Energy Tab */}
          {activeTab === "monitor" && <MonitorEnergy />}

          {/* Chat with AI Tab */}
          {activeTab === "chat-ai" && <ChatWithAi />}

          {/* Create New Socket Tab */}
          {activeTab === "create-socket" && <CreateSocket />}

          {/* Settings Tab */}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
