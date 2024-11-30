import React, { useEffect, useState } from "react";
import { isMobile, isTablet, isDesktop, browserName, osName, osVersion, isChrome, isFirefox } from "react-device-detect";
import { FaWifi, FaDesktop, FaMobileAlt, FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css"; // Import the toast CSS

const App = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    ip: null,
    browser: browserName || "Unknown",
    os: `${osName || "Unknown"} ${osVersion || ""}`,
    screenSize: `${window.innerWidth} x ${window.innerHeight}`,
  });

  useEffect(() => {
    // Fetch IP address using an API
    axios.get("https://api.ipify.org?format=json")
      .then(response => {
        setDeviceInfo(prevState => ({
          ...prevState,
          ip: response.data.ip,
        }));
      })
      .catch(() => {
        toast.error("Failed to fetch IP address!");
      });
  }, []);

  const notify = () => toast.info("Device Info Loaded!");

  useEffect(() => {
    notify();
  }, []);

  return (
    <>
      <Helmet>
        <title>Device Info</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full p-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
            Device Information
          </h1>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaDesktop className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Device Type:</strong> 
                {isMobile ? (
                  "Mobile"
                ) : isTablet ? (
                  "Tablet"
                ) : isDesktop ? (
                  "Desktop"
                ) : (
                  "Unknown"
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaWifi className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>IP Address:</strong> {deviceInfo.ip || "Loading..."}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Browser:</strong> {deviceInfo.browser}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>OS:</strong> {deviceInfo.os}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaMobileAlt className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Screen Size:</strong> {deviceInfo.screenSize}
              </div>
            </div>
          </div>

          {/* Device Info Buttons */}
          <div className="mt-6 space-x-4 text-center">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              data-tip="More device details"
            >
              More Info
            </button>
            <ReactTooltip place="top" effect="solid" />
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default App;
