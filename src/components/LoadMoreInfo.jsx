import React from "react";
import { FaMemory, FaMicrochip, FaRegClock, FaLocationArrow } from "react-icons/fa";

const LoadMoreInfo = ({ deviceInfo }) => {
  return (
    <div className="space-y-4 mt-4">
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

      {/* Time Zone */}
      <div className="flex items-center space-x-3">
        <FaRegClock className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Time Zone:</strong> {deviceInfo.timeZone}
        </div>
      </div>

      {/* Screen Orientation */}
      <div className="flex items-center space-x-3">
        <FaRegClock className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Screen Orientation:</strong> {deviceInfo.screenOrientation || "Unknown"}
        </div>
      </div>

      {/* Geolocation */}
      <div className="flex items-center space-x-3">
        <FaLocationArrow className="text-2xl text-gray-600" />
        <div className="text-lg">
          <strong>Geolocation:</strong> {deviceInfo.geolocation || "Fetching..."}
        </div>
      </div>
    </div>
  );
};

export default LoadMoreInfo;
