import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaDesktop,
  FaMobileAlt,
  FaCode,
  FaWifi,
  FaGlobeAmericas,
  FaBatteryThreeQuarters,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import { isMobile, isTablet, browserName, osName } from "react-device-detect";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [userAgent, setUserAgent] = useState("");
  const [os, setOs] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [screenResolution, setScreenResolution] = useState("");
  const [browser, setBrowser] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");
  const [connectionType, setConnectionType] = useState("");
  const [networkInfo, setNetworkInfo] = useState("");
  const [batteryInfo, setBatteryInfo] = useState(null);
  const [windowSize, setWindowSize] = useState("");
  const [deviceMemory, setDeviceMemory] = useState("");
  const [colorDepth, setColorDepth] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [cpuCores, setCpuCores] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("isDarkMode")) || false
  );

  useEffect(() => {
    // Set basic device details
    setUserAgent(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop");
    setOs(osName);
    setBrowser(browserName);
    setScreenResolution(`${window.screen.width} x ${window.screen.height}`);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setLanguage(navigator.language || navigator.userLanguage);
    setColorDepth(`${window.screen.colorDepth}-bit`);
    setDeviceMemory(navigator.deviceMemory || "Unknown");
    setCpuCores(navigator.hardwareConcurrency || "Unknown");
    setConnectionType(navigator.onLine ? "Online" : "Offline");

    // Fetch IP Information
    axios
      .get("https://ip-api.com/json")
      .then((response) => {
        console.log("IP Info Response:", response.data); // Debug
        setIpInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching IP info:", error);
        setIpInfo(null);
      });

    // Network Information
    if (navigator.connection) {
      const { effectiveType, downlink, rtt } = navigator.connection;
      setNetworkInfo(
        `Type: ${effectiveType || "Unknown"}, Downlink: ${
          downlink || "Unknown"
        } Mbps, RTT: ${rtt || "Unknown"} ms`
      );
    } else {
      setNetworkInfo("Not Available");
    }

    // Battery Information
    if ("getBattery" in navigator) {
      navigator
        .getBattery()
        .then((battery) =>
          setBatteryInfo({
            level: battery.level,
            charging: battery.charging,
          })
        )
        .catch(() => setBatteryInfo(null));
    }

    // Update window size on resize
    const updateWindowSize = () =>
      setWindowSize(`${window.innerWidth} x ${window.innerHeight}`);
    window.addEventListener("resize", updateWindowSize);
    updateWindowSize();

    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
      clearInterval(timeInterval);
    };
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("isDarkMode", JSON.stringify(newMode));
  };

  // Copy Text to Clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard!");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Helmet>
        <title>Device Info Hub</title>
        <meta name="description" content="Detailed device, browser, and network info." />
      </Helmet>

      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Device Info Hub</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          >
            {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaMoon />}
          </button>
        </div>
      </header>

      <main className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 min-h-screen py-10 text-white">
        <div className="container mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold">Device Details</h2>

          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <p><strong>Device Type:</strong> {deviceType}</p>
              <p><strong>OS:</strong> {os}</p>
              <p><strong>Browser:</strong> {browser}</p>
              <p><strong>Resolution:</strong> {screenResolution}</p>
              <p><strong>Window Size:</strong> {windowSize}</p>
              <p><strong>Memory:</strong> {deviceMemory} GB</p>
              <p><strong>CPU Cores:</strong> {cpuCores}</p>
              <p><strong>Color Depth:</strong> {colorDepth}</p>
              <p><strong>Timezone:</strong> {timezone}</p>
              <p><strong>Language:</strong> {language}</p>
              <p><strong>Network:</strong> {networkInfo}</p>
              <p><strong>Connection:</strong> {connectionType}</p>
              <p><strong>Current Time:</strong> {currentTime}</p>
              {batteryInfo && (
                <>
                  <p><strong>Battery Level:</strong> {Math.round(batteryInfo.level * 100)}%</p>
                  <p><strong>Charging:</strong> {batteryInfo.charging ? "Yes" : "No"}</p>
                </>
              )}
            </div>

            {ipInfo ? (
              <div className="mt-6">
                <h4 className="font-semibold">IP Information</h4>
                <p><strong>IP:</strong> {ipInfo.query}</p>
                <p><strong>Location:</strong> {ipInfo.city}, {ipInfo.regionName}, {ipInfo.country}</p>
                <p><strong>ISP:</strong> {ipInfo.isp}</p>
                <p><strong>Latitude:</strong> {ipInfo.lat}</p>
                <p><strong>Longitude:</strong> {ipInfo.lon}</p>
              </div>
            ) : (
              <p>Fetching IP information...</p>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 Device Info Hub</p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default App;
