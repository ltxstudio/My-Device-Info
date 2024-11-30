import React, { useEffect, useState } from "react";
import { isMobile, isTablet, isDesktop, browserName, osName, osVersion } from "react-device-detect";
import { FaWifi, FaDesktop, FaMobileAlt, FaInfoCircle, FaLocationArrow, FaBatteryFull, FaNetworkWired, FaMemory, FaMicrochip, FaRegClock, FaGlobe } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css"; // Import the toast CSS

const App = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    ip: null,
    browser: browserName || "Unknown",
    os: `${osName || "Unknown"} ${osVersion || ""}`,
    screenSize: `${window.innerWidth} x ${window.innerHeight}`,
    battery: null,
    networkType: null,
    geolocation: null,
    deviceMemory: null,
    cpuCores: null,
    pixelRatio: window.devicePixelRatio || "Unknown",
    screenOrientation: null,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    userAgent: navigator.userAgent || "Unknown",
    ipLocation: null,
  });

  useEffect(() => {
    // Fetch IP address using an API
    axios.get("https://api.ipify.org?format=json")
      .then(response => {
        setDeviceInfo(prevState => ({
          ...prevState,
          ip: response.data.ip,
        }));

        // Fetch IP location information using IP Geolocation API
        axios.get(`https://ipinfo.io/${response.data.ip}/json`)
          .then(ipResponse => {
            setDeviceInfo(prevState => ({
              ...prevState,
              ipLocation: `${ipResponse.data.city}, ${ipResponse.data.country}`,
            }));
          })
          .catch(() => {
            toast.error("Failed to fetch IP location!");
          });
      })
      .catch(() => {
        toast.error("Failed to fetch IP address!");
      });
  }, []);

  useEffect(() => {
    // Get Battery Info
    navigator.getBattery().then(battery => {
      setDeviceInfo(prevState => ({
        ...prevState,
        battery: `${Math.round(battery.level * 100)}% - ${battery.charging ? 'Charging' : 'Not Charging'}`,
      }));
    });

    // Get Network Info
    if (navigator.connection) {
      const { effectiveType } = navigator.connection;
      setDeviceInfo(prevState => ({
        ...prevState,
        networkType: effectiveType,
      }));
    }

    // Get Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeviceInfo(prevState => ({
            ...prevState,
            geolocation: `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`,
          }));
        },
        () => {
          toast.error("Failed to fetch geolocation!");
        }
      );
    }

    // Get Device Memory (RAM)
    const memory = navigator.deviceMemory;
    if (memory) {
      setDeviceInfo(prevState => ({
        ...prevState,
        deviceMemory: `${memory} GB`,
      }));
    }

    // Get CPU Cores
    const cpuCores = navigator.hardwareConcurrency;
    if (cpuCores) {
      setDeviceInfo(prevState => ({
        ...prevState,
        cpuCores: cpuCores,
      }));
    }

    // Get Screen Orientation
    if (screen.orientation) {
      setDeviceInfo(prevState => ({
        ...prevState,
        screenOrientation: screen.orientation.type,
      }));
    }

    const notify = () => toast.info("Device Info Loaded!");
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
            {/* Device Type */}
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

            {/* IP Address */}
            <div className="flex items-center space-x-3">
              <FaWifi className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>IP Address:</strong> {deviceInfo.ip || "Loading..."}
              </div>
            </div>

            {/* IP Location */}
            <div className="flex items-center space-x-3">
              <FaGlobe className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>IP Location:</strong> {deviceInfo.ipLocation || "Fetching..."}
              </div>
            </div>

            {/* User Agent */}
            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>User Agent:</strong> {deviceInfo.userAgent}
              </div>
            </div>

            {/* Browser */}
            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Browser:</strong> {deviceInfo.browser}
              </div>
            </div>

            {/* OS */}
            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>OS:</strong> {deviceInfo.os}
              </div>
            </div>

            {/* Screen Size */}
            <div className="flex items-center space-x-3">
              <FaMobileAlt className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Screen Size:</strong> {deviceInfo.screenSize}
              </div>
            </div>

            {/* Battery Info */}
            <div className="flex items-center space-x-3">
              <FaBatteryFull className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Battery Status:</strong> {deviceInfo.battery || "Loading..."}
              </div>
            </div>

            {/* Network Type */}
            <div className="flex items-center space-x-3">
              <FaNetworkWired className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Network Type:</strong> {deviceInfo.networkType || "Unknown"}
              </div>
            </div>

            {/* Geolocation */}
            <div className="flex items-center space-x-3">
              <FaLocationArrow className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Geolocation:</strong> {deviceInfo.geolocation || "Fetching..."}
              </div>
            </div>

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

            {/* Pixel Ratio */}
            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Pixel Ratio:</strong> {deviceInfo.pixelRatio}
              </div>
            </div>

            {/* Screen Orientation */}
            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Screen Orientation:</strong> {deviceInfo.screenOrientation || "Unknown"}
              </div>
            </div>

            {/* Time Zone */}
            <div className="flex items-center space-x-3">
              <FaRegClock className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Time Zone:</strong> {deviceInfo.timeZone}
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
