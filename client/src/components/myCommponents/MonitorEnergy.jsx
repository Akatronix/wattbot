import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useUserStore from "@/store/UserStore";

const MonitorEnergy = () => {
  const { userData } = useUserStore();

  // Calculate total power consumption (only for active devices)
  const totalPower = userData
    .filter((device) => device.switchStatus)
    .reduce((sum, device) => sum + device.power, 0);

  // Calculate usage per location
  const locationUsage = {};
  userData.forEach((device) => {
    if (device.switchStatus) {
      if (!locationUsage[device.location]) {
        locationUsage[device.location] = 0;
      }
      locationUsage[device.location] += device.power;
    }
  });

  // Calculate percentage for circular progress
  // Max possible power = number of devices * 100W (since each device max is 100W)
  const maxPossiblePower = userData.length * 100;
  const usagePercentage = Math.min(
    100,
    Math.round((totalPower / maxPossiblePower) * 100)
  );

  // Colors for different locations
  const locationColors = {
    "Living Room": "blue",
    Kitchen: "green",
    Bedroom: "yellow",
    Bathroom: "purple",
    "Study Room": "indigo",
  };

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monitor Energy Consumption
          </h1>
          <p className="text-gray-600">
            Real-time energy usage across all devices
          </p>
        </div>

        {/* Current Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>Real-time energy consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="h-48 w-48 rounded-full border-8 border-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {totalPower} KW
                    </div>
                    <div className="text-gray-500">Total Usage</div>
                  </div>
                </div>
                <div
                  className="absolute top-0 left-0 h-48 w-48 rounded-full border-8 border-blue-500 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent transform -rotate-45"
                  style={{
                    transform: `rotate(${usagePercentage * 3.6 - 45}deg)`,
                    transition: "transform 0.5s ease-in-out",
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(locationUsage).map(([location, power], index) => {
                const color = locationColors[location] || "gray";
                return (
                  <div
                    key={index}
                    className={`text-center p-3 bg-${color}-50 rounded-lg`}
                  >
                    <div className={`text-lg font-semibold text-${color}-700`}>
                      {power} KW
                    </div>
                    <div className="text-sm text-gray-600">{location}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Devices List */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>
              All your smart sockets and devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.map((device, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-3 ${
                        device.switchStatus ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-500">
                        {device.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {device.switchStatus ? `${device.power} KW` : "0 KW"}
                    </div>
                    <div
                      className={`text-sm ${
                        device.switchStatus ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {device.switchStatus ? "On" : "Off"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitorEnergy;
