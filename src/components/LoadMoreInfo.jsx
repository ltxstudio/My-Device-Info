import React, { useEffect, useState } from "react";
import { FaMemory, FaMicrochip, FaRegClock, FaBatteryFull, FaWifi, FaLocationArrow, FaNetworkWired, FaDesktop } from "react-icons/fa";

const LoadMoreInfo = ({ deviceInfo }) => {
  const [batteryStatus, setBatteryStatus] = useState(null);
  const [networkType, setNetworkType] = useState(null);
  const [geolocation, setGeolocation] = useState(null);
  const [screenOrientation, setScreenOrientation] = useState(deviceInfo.screenOrientation);

  // Get Battery Info
  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        setBatteryStatus(`${Math.round(battery.level * 100)}% - ${battery.charging ? 'Charging' : 'Not Charging'}`);
      });
    }
  }, []);

  // Get Network Type
  useEffect(() => {
    if (navigator.connection) {
      const { effectiveType } = navigator.connection;
      setNetworkType(effectiveType);
    }
  }, []);

  // Get Geolocation Info
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
        },
        (error) => {
          setGeolocation("Unable to fetch geolocation");
        }
      );
    }
  }, []);

  // Listen for screen orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (screen.orientation) {
        setScreenOrientation(screen.orientation.type);
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <div className="mt-6 space-y-4">
      {/* Device Memory */}
      <div className="flex items-center space-x-3">
        <FaMemory className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Device Memory:</strong> {deviceInfo.deviceMemory || "Unknown"}
        </div>
      </div>

      {/* CPU Cores */}
      <div className="flex items-center space-x-3">
        <FaMicrochip className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>CPU Cores:</strong> {deviceInfo.cpuCores || "Unknown"}
        </div>
      </div>

      {/* Screen Orientation */}
      <div className="flex items-center space-x-3">
        <FaRegClock className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Screen Orientation:</strong> {screenOrientation || "Unknown"}
        </div>
      </div>

      {/* Time Zone */}
      <div className="flex items-center space-x-3">
        <FaRegClock className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Time Zone:</strong> {deviceInfo.timeZone}
        </div>
      </div>

      {/* Battery Status */}
      <div className="flex items-center space-x-3">
        <FaBatteryFull className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Battery Status:</strong> {batteryStatus || "Fetching..."}
        </div>
      </div>

      {/* Network Type */}
      <div className="flex items-center space-x-3">
        <FaNetworkWired className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Network Type:</strong> {networkType || "Unknown"}
        </div>
      </div>

      {/* Geolocation */}
      <div className="flex items-center space-x-3">
        <FaLocationArrow className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Geolocation:</strong> {geolocation || "Fetching..."}
        </div>
      </div>

      {/* Device Type (Desktop, Tablet, Mobile) */}
      <div className="flex items-center space-x-3">
        <FaDesktop className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Device Type:</strong> 
          {deviceInfo.isMobile ? "Mobile" : deviceInfo.isTablet ? "Tablet" : "Desktop"}
        </div>
      </div>
    </div>
  );
};

export default LoadMoreInfo;
