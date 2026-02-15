// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Power,
//   Thermometer,
//   Snowflake,
//   Lightbulb,
//   Droplets,
//   Wifi,
//   AlertTriangle, // Added for the warning icon
// } from "lucide-react";
// import useUserStore from "@/store/UserStore";
// import { useSocketStore } from "@/store/socketStore";
// import DeleteSockect from "./DeleteSockect";

// const ControlDevices = () => {
//   const { userData } = useUserStore();
//   const { updateDeviceStatus } = useSocketStore();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const toggleDeviceStatus = (deviceId, switchStatus) => {
//     updateDeviceStatus({ id: deviceId, status: !switchStatus });
//   };

//   const getDeviceIcon = (type) => {
//     switch (type) {
//       case "ac":
//         return Snowflake;
//       case "heater":
//         return Thermometer;
//       case "lighting":
//         return Lightbulb;
//       case "geyser":
//         return Droplets;
//       default:
//         return Wifi;
//     }
//   };

//   // --- NEW: Power Badge Logic ---
//   const getPowerBadge = (currentPower, maxPower) => {
//     if (!maxPower || maxPower === 0) return null;

//     const isExceeded = currentPower >= maxPower;
//     const isWarning = currentPower >= maxPower * 0.9; // Warning at 90% capacity

//     if (isExceeded) {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse border border-red-200">
//           <AlertTriangle className="h-3 w-3" /> OVER LIMIT
//         </span>
//       );
//     }

//     if (isWarning) {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
//           <AlertTriangle className="h-3 w-3" /> WARNING
//         </span>
//       );
//     }

//     return null;
//   };

//   const formatPower = (power) => {
//     return `${power} KW`;
//   };

//   const locations = [...new Set(userData.map((device) => device.location))];

//   return (
//     <div className="space-y-6">
//       <div>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Control Devices</h1>
//           <p className="text-gray-600">
//             Turn your smart devices on or off remotely
//           </p>
//         </div>
//         <div>
//           {loading && <p className="text-blue-600">Loading...</p>}
//           {error && <p className="text-red-600">Error: {error}</p>}
//         </div>
//       </div>

//       <div className="space-y-6">
//         {locations.map((room) => {
//           const roomDevices = userData.filter(
//             (device) => device.location === room
//           );

//           return (
//             <Card key={room}>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <span className="mr-2">{room}</span>
//                   <span className="text-sm font-normal text-gray-500">
//                     ({roomDevices.filter((d) => d.switchStatus).length} of{" "}
//                     {roomDevices.length} active)
//                   </span>
//                 </CardTitle>
//                 <CardDescription>Devices in {room}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {roomDevices.map((device) => {
//                     const IconComponent = getDeviceIcon(device.type);
//                     return (
//                       <div
//                         key={device._id}
//                         className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//                       >
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center">
//                             <div
//                               className={`p-2 rounded-lg mr-3 ${
//                                 device.switchStatus
//                                   ? "bg-blue-100"
//                                   : "bg-gray-100"
//                               }`}
//                             >
//                               <IconComponent
//                                 className={`h-5 w-5 ${
//                                   device.switchStatus
//                                     ? "text-blue-600"
//                                     : "text-gray-500"
//                                 }`}
//                               />
//                             </div>
//                             <div>
//                               <h3 className="font-medium">{device.name}</h3>
//                               <div className="flex items-center gap-2">
//                                 <p className="text-sm text-gray-500">
//                                   {formatPower(device.power)}
//                                 </p>
//                                 {/* Badge added here */}
//                                 {getPowerBadge(device.power, device.maxPower)}
//                               </div>
//                               <p className="text-sm text-gray-500">
//                                 ID: {device._id}
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() =>
//                               toggleDeviceStatus(
//                                 device._id,
//                                 device.switchStatus
//                               )
//                             }
//                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                               device.switchStatus
//                                 ? "bg-blue-600"
//                                 : "bg-gray-300"
//                             }`}
//                           >
//                             <span
//                               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                 device.switchStatus
//                                   ? "translate-x-6"
//                                   : "translate-x-1"
//                               }`}
//                             />
//                           </button>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center justify-start gap-2 flex-nowrap">
//                             <span
//                               className={`text-xs px-2 py-1 rounded-full ${
//                                 device.switchStatus
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >
//                               {device.switchStatus ? "ON" : "OFF"}
//                             </span>
//                             <DeleteSockect
//                               socket={device._id}
//                               setLoading={setLoading}
//                               setError={setError}
//                             />
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             {device.switchStatus ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Devices</CardTitle>
//           <CardDescription>
//             Control all your smart devices from one place
//             {!userData.length && (
//               <p className="text-gray-500 mt-4 w-full text-center">
//                 No devices found.
//               </p>
//             )}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {userData.map((device) => {
//               const IconComponent = getDeviceIcon(device.type);
//               return (
//                 <div
//                   key={device._id}
//                   className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center">
//                       <div
//                         className={`p-2 rounded-lg mr-3 ${
//                           device.switchStatus ? "bg-blue-100" : "bg-gray-100"
//                         }`}
//                       >
//                         <IconComponent
//                           className={`h-5 w-5 ${
//                             device.switchStatus
//                               ? "text-blue-600"
//                               : "text-gray-500"
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <h3 className="font-medium">{device.name}</h3>
//                         <p className="text-sm text-gray-500 flex gap-0.5 items-start justify-start">
//                           Location: {device.location}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           ID: {device._id}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         toggleDeviceStatus(device._id, device.switchStatus);
//                       }}
//                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                         device.switchStatus ? "bg-blue-600" : "bg-gray-300"
//                       }`}
//                     >
//                       <span
//                         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                           device.switchStatus
//                             ? "translate-x-6"
//                             : "translate-x-1"
//                         }`}
//                       />
//                     </button>
//                   </div>
//                   <div className="w-full flex items-start justify-start gap-4  mb-4">
//                     <div>
//                       <p className="text-sm text-gray-500">
//                         Volatge: {device.voltage} V
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Current: {device.current} A
//                       </p>
//                     </div>
//                     <div>
//                       <div className="flex flex-col">
//                         <p className="text-sm text-gray-500">
//                           Power: {formatPower(device.power)}
//                         </p>
//                         {/* Badge added here for detailed view */}
//                         <div className="mt-1">
//                           {getPowerBadge(device.power, device.maxPower)}
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500">
//                         Energy: {device.energy} kWh
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center justify-start gap-2 flex-nowrap">
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           device.switchStatus
//                             ? "bg-green-100 text-green-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {device.switchStatus ? "ON" : "OFF"}
//                       </span>
//                       <DeleteSockect
//                         socket={device._id}
//                         setLoading={setLoading}
//                         setError={setError}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//           <CardDescription>Control multiple devices at once</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <Button
//               variant="outline"
//               className="flex flex-col items-center justify-center h-20"
//               onClick={() => {
//                 userData.forEach((device) => {
//                   if (!device.switchStatus) {
//                     updateDeviceStatus({
//                       id: device._id,
//                       status: !device.switchStatus,
//                     });
//                   }
//                 });
//               }}
//             >
//               <Power className="h-6 w-6 mb-1" />
//               <span>Turn All On</span>
//             </Button>
//             <Button
//               variant="outline"
//               className="flex flex-col items-center justify-center h-20"
//               onClick={() => {
//                 userData.forEach((device) => {
//                   if (device.switchStatus) {
//                     updateDeviceStatus({
//                       id: device._id,
//                       status: !device.switchStatus,
//                     });
//                   }
//                 });
//               }}
//             >
//               <Power className="h-6 w-6 mb-1" />
//               <span>Turn All Off</span>
//             </Button>
//             <Button
//               variant="outline"
//               className="flex flex-col items-center justify-center h-20"
//               onClick={() => {
//                 userData.forEach((device, index) => {
//                   if (device.type === "lighting" && !device.switchStatus) {
//                     updateDeviceStatus({
//                       id: device._id,
//                       status: !device.switchStatus,
//                     });
//                   }
//                 });
//               }}
//             >
//               <Lightbulb className="h-6 w-6 mb-1" />
//               <span>Lights On</span>
//             </Button>
//             <Button
//               variant="outline"
//               className="flex flex-col items-center justify-center h-20"
//               onClick={() => {
//                 userData.forEach((device) => {
//                   if (device.type === "lighting" && device.switchStatus) {
//                     updateDeviceStatus({
//                       id: device._id,
//                       status: !device.switchStatus,
//                     });
//                   }
//                 });
//               }}
//             >
//               <Lightbulb className="h-6 w-6 mb-1" />
//               <span>Lights Off</span>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ControlDevices;







import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Power,
  Thermometer,
  Snowflake,
  Lightbulb,
  Droplets,
  Wifi,
  AlertTriangle,
} from "lucide-react";
import useUserStore from "@/store/UserStore";
import { useSocketStore } from "@/store/socketStore";
import DeleteSockect from "./DeleteSockect";
import { toast } from "sonner"; // Only import the toast function

const ControlDevices = () => {
  const { userData } = useUserStore();
  const { updateDeviceStatus } = useSocketStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifiedSockets, setNotifiedSockets] = useState(new Set()); // Track notified sockets to prevent spam

  // Check for sockets that exceed their limit and show toast
  useEffect(() => {
    userData.forEach((device) => {
      const isExceeding = device.maxPower && device.maxPower > 0 && device.power >= device.maxPower;
      const wasNotified = notifiedSockets.has(device._id);

      if (isExceeding && !wasNotified) {
        // Show toast for new exceeded limit
        toast.error(
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <div>
              <p className="font-semibold">{device.name} has exceeded its limit</p>
              <div className="text-xs mt-1 space-y-0.5">
                <p>Normal Power (Limit): <span className="font-medium">{device.maxPower} kW</span></p>
                <p>Currently Consuming: <span className="font-medium">{device.power} kW</span></p>
              </div>
            </div>
          </div>,
          {
            id: `limit-exceeded-${device._id}`, // Use a unique ID to prevent duplicates
            duration: Infinity, // Keep it visible until the user dismisses it or the issue is resolved
            position: 'bottom-right',
          }
        );
        
        // Add to notified set
        setNotifiedSockets(prev => new Set(prev).add(device._id));
      } else if (!isExceeding && wasNotified) {
        // If the socket is no longer exceeding the limit, dismiss the toast and remove from the set
        toast.dismiss(`limit-exceeded-${device._id}`);
        setNotifiedSockets(prev => {
          const newSet = new Set(prev);
          newSet.delete(device._id);
          return newSet;
        });
      }
    });
  }, [userData, notifiedSockets]);

  const toggleDeviceStatus = (deviceId, switchStatus) => {
    updateDeviceStatus({ id: deviceId, status: !switchStatus });
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case "ac":
        return Snowflake;
      case "heater":
        return Thermometer;
      case "lighting":
        return Lightbulb;
      case "geyser":
        return Droplets;
      default:
        return Wifi;
    }
  };

  // --- Power Badge Logic ---
  const getPowerBadge = (currentPower, maxPower) => {
    if (!maxPower || maxPower === 0) return null;

    const isExceeded = currentPower >= maxPower;
    const isWarning = currentPower >= maxPower * 0.9; // Warning at 90% capacity

    if (isExceeded) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse border border-red-200">
          <AlertTriangle className="h-3 w-3" /> OVER LIMIT
        </span>
      );
    }

    if (isWarning) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
          <AlertTriangle className="h-3 w-3" /> WARNING
        </span>
      );
    }

    return null;
  };

  const formatPower = (power) => {
    return `${power} KW`;
  };

  const locations = [...new Set(userData.map((device) => device.location))];

  return (
    <div className="space-y-6">
      <div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control Devices</h1>
          <p className="text-gray-600">
            Turn your smart devices on or off remotely
          </p>
        </div>
        <div>
          {loading && <p className="text-blue-600">Loading...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      </div>

      <div className="space-y-6">
        {locations.map((room) => {
          const roomDevices = userData.filter(
            (device) => device.location === room
          );

          return (
            <Card key={room}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">{room}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({roomDevices.filter((d) => d.switchStatus).length} of{" "}
                    {roomDevices.length} active)
                  </span>
                </CardTitle>
                <CardDescription>Devices in {room}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomDevices.map((device) => {
                    const IconComponent = getDeviceIcon(device.type);
                    return (
                      <div
                        key={device._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-lg mr-3 ${
                                device.switchStatus
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <IconComponent
                                className={`h-5 w-5 ${
                                  device.switchStatus
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                }`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{device.name}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">
                                  {formatPower(device.power)}
                                </p>
                                {/* Badge added here */}
                                {getPowerBadge(device.power, device.maxPower)}
                              </div>
                              <p className="text-sm text-gray-500">
                                ID: {device._id}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              toggleDeviceStatus(
                                device._id,
                                device.switchStatus
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              device.switchStatus
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                device.switchStatus
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center justify-start gap-2 flex-nowrap">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                device.switchStatus
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {device.switchStatus ? "ON" : "OFF"}
                            </span>
                            <DeleteSockect
                              socket={device._id}
                              setLoading={setLoading}
                              setError={setError}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {device.switchStatus ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
          <CardDescription>
            Control all your smart devices from one place
            {!userData.length && (
              <p className="text-gray-500 mt-4 w-full text-center">
                No devices found.
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.map((device) => {
              const IconComponent = getDeviceIcon(device.type);
              return (
                <div
                  key={device._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          device.switchStatus ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            device.switchStatus
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-gray-500 flex gap-0.5 items-start justify-start">
                          Location: {device.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {device._id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toggleDeviceStatus(device._id, device.switchStatus);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        device.switchStatus ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          device.switchStatus
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="w-full flex items-start justify-start gap-4  mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Volatge: {device.voltage} V
                      </p>
                      <p className="text-sm text-gray-500">
                        Current: {device.current} A
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-500">
                          Power: {formatPower(device.power)}
                        </p>
                        {/* Badge added here for detailed view */}
                        <div className="mt-1">
                          {getPowerBadge(device.power, device.maxPower)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Energy: {device.energy} kWh
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-start gap-2 flex-nowrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          device.switchStatus
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {device.switchStatus ? "ON" : "OFF"}
                      </span>
                      <DeleteSockect
                        socket={device._id}
                        setLoading={setLoading}
                        setError={setError}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Control multiple devices at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device) => {
                  if (!device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Power className="h-6 w-6 mb-1" />
              <span>Turn All On</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device) => {
                  if (device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Power className="h-6 w-6 mb-1" />
              <span>Turn All Off</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device, index) => {
                  if (device.type === "lighting" && !device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Lightbulb className="h-6 w-6 mb-1" />
              <span>Lights On</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20"
              onClick={() => {
                userData.forEach((device) => {
                  if (device.type === "lighting" && device.switchStatus) {
                    updateDeviceStatus({
                      id: device._id,
                      status: !device.switchStatus,
                    });
                  }
                });
              }}
            >
              <Lightbulb className="h-6 w-6 mb-1" />
              <span>Lights Off</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlDevices;
