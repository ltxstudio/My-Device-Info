import React, { useEffect, useState } from "react";
import { isMobile, isTablet, isDesktop, browserName, osName, osVersion } from "react-device-detect";
import { FaWifi, FaDesktop, FaMobileAlt, FaInfoCircle, FaLocationArrow, FaBatteryFull, FaNetworkWired, FaMemory, FaMicrochip, FaRegClock, FaGlobe } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css"; // Import the toast CSS 
import LoadMoreInfo from "./components/LoadMoreInfo"; // Import the new component

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

  const [showMoreInfo, setShowMoreInfo] = useState(false); // State for toggling additional info visibility

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
        <title>Device Information</title>
        <meta name="description" content="Get detailed information about your device, including browser, OS, IP address, battery status, geolocation, and more." />
        <meta name="keywords" content="device info, browser details, operating system, battery status, geolocation, screen resolution" />
        <meta name="author" content="Your Name" />
        <meta property="og:title" content="Device Information" />
        <meta property="og:description" content="Explore the detailed device information such as IP address, browser, battery status, and more." />
        <meta property="og:image" content="https://your-site.com/your-image.jpg" />
        <meta property="og:url" content="https://your-site.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@your-twitter-handle" />
        <meta name="twitter:title" content="Device Information" />
        <meta name="twitter:description" content="Detailed device info including browser, OS, IP, and more." />
        <meta name="twitter:image" content="https://your-site.com/your-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full p-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
            Device Information
          </h1>

          <div className="space-y-4">
            {/* Basic Device Info */}
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
              <FaGlobe className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>IP Location:</strong> {deviceInfo.ipLocation || "Fetching..."}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaInfoCircle className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>User Agent:</strong> {deviceInfo.userAgent}
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

            <div className="flex items-center space-x-3">
              <FaBatteryFull className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Battery Status:</strong> {deviceInfo.battery || "Loading..."}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaNetworkWired className="text-2xl text-gray-600" />
              <div className="text-lg">
                <strong>Network Type:</strong> {deviceInfo.networkType || "Loading..."}
              </div>
            </div>

            {/* Show More Info */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
            >
              {showMoreInfo ? "Show Less Info" : "Show More Info"}
            </button>

            {showMoreInfo && <LoadMoreInfo deviceInfo={deviceInfo} />}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default App;
