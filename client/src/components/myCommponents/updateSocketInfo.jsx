import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";

// --- Local API Request Helper for Updating Socket Info ---
const updateSocketData = async (id, dataToUpdate) => {
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/sockets/updateData`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    body: JSON.stringify({ id, ...dataToUpdate }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update socket");
  }

  return response.json();
};

// --- Local API Request Helper for Setting Max Power ---
const setMaxPowerAPI = async (id, maxPowerValue) => {
  // Use the host from env file as requested
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/sockets/setPower/${id}`;

  const response = await fetch(API_URL, {
    method: "POST", // Method set to POST
    headers: {
      "Content-Type": "application/json",
      "token": localStorage.getItem("token"), // Token from local storage
    },
    body: JSON.stringify({ 
        maxPower: Number(maxPowerValue) 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to set max power");
  }

  return response.json();
};

// --- The SetMaxPowerForm Component ---
const SetMaxPowerForm = () => {
  const [socketId, setSocketId] = useState("");
  const [maxPowerInput, setMaxPowerInput] = useState(""); // Renamed to avoid conflict with API function
  const [loading, setLoading] = useState(false);

  const handleMaxPowerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!socketId || !maxPowerInput || isNaN(maxPowerInput) || Number(maxPowerInput) < 0) {
      toast.error("Please enter a valid Socket ID and a non-negative Max Power value.");
      setLoading(false);
      return;
    }

    try {
      // Calling the API helper
      await setMaxPowerAPI(socketId, maxPowerInput);
      toast.success(`Max power for socket ${socketId} set to ${maxPowerInput}W.`);
      setMaxPowerInput("");
      setSocketId("");
    } catch (err) {
      console.error(err);
      toast.error("Error setting max power: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Socket Max Power</CardTitle>
        <CardDescription>
          Set a maximum power limit (in Watts) for a specific socket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMaxPowerSubmit} className="space-y-4">
          <div>
            <label htmlFor="max-power-id" className="block text-sm font-medium text-gray-700 mb-1">
              Socket ID
            </label>
            <input
              type="text"
              id="max-power-id"
              value={socketId}
              onChange={(e) => setSocketId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Socket ID (e.g., 6936...)"
              required
            />
          </div>

          <div>
            <label htmlFor="max-power-value" className="block text-sm font-medium text-gray-700 mb-1">
              Max Power (Watts)
            </label>
            <input
              type="number"
              id="max-power-value"
              value={maxPowerInput}
              onChange={(e) => setMaxPowerInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 230"
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 w-full">
              {loading ? "Setting..." : "Set Max Power"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// --- The Main UpdateSocketInfo Component ---
const UpdateSocketInfo = ({ initialData }) => {
  const [socketForm, setSocketForm] = useState({
    id: "",
    name: "",
    location: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSocketForm((prev) => ({
        ...prev,
        name: initialData.name || "",
        location: initialData.location || "",
        type: initialData.type || "",
      }));
    }
  }, [initialData]);

  const handleSocketFormChange = (e) => {
    const { name, value } = e.target;
    setSocketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocketSubmit = async (e) => {
    e.preventDefault();

    if (!socketForm.id || !socketForm.name || !socketForm.location || !socketForm.type) {
      toast.error("Please fill in all fields, including the Socket ID.");
      return;
    }

    setLoading(true);
    try {
      const { id, ...dataToUpdate } = socketForm;
      const response = await updateSocketData(id, dataToUpdate);

      if (!response.success) {
        toast.error(response.message || "Failed to update socket");
        return;
      }

      toast.success("Socket updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating socket: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Socket</h1>
          <p className="text-gray-600">
            Enter the Socket ID and modify the details for your smart socket.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Socket Details</CardTitle>
            <CardDescription>
              Provide the ID of the socket you want to update.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocketSubmit} className="space-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                  Socket ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={socketForm.id}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the ID of the socket to update"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Socket Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={socketForm.name}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Living Room Socket"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={socketForm.location}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Living Room"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={socketForm.type}
                  onChange={handleSocketFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a device type</option>
                  <option value="ac">Air Conditioner</option>
                  <option value="heater">Heater</option>
                  <option value="refrigerator">Refrigerator</option>
                  <option value="washing">Washing Machine</option>
                  <option value="lighting">Lighting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Updating..." : "Update Socket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <SetMaxPowerForm />
      </div>
    </div>
  );
};

export default UpdateSocketInfo;
