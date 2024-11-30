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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Set device info
    setUserAgent(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop");
    setOs(osName);
    setBrowser(browserName);
    setScreenResolution(`${window.screen.width} x ${window.screen.height}`);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setLanguage(navigator.language || navigator.userLanguage);
    setColorDepth(`${window.screen.colorDepth}-bit`);
    setCurrentTime(new Date().toLocaleString());

    // Fetch IP info
    axios
      .get("http://ip-api.com/json")
      .then((response) => setIpInfo(response.data))
      .catch((error) => console.error("Error fetching IP info:", error));

    // Network info
    if (navigator.connection) {
      setNetworkInfo(navigator.connection.downlink + " Mbps");
    } else {
      setNetworkInfo("Not Available");
    }

    setConnectionType(navigator.onLine ? "Online" : "Offline");

    // Battery info
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => setBatteryInfo(battery));
    }

    // Window resize listener
    const updateWindowSize = () => setWindowSize(`${window.innerWidth} x ${window.innerHeight}`);
    window.addEventListener("resize", updateWindowSize);
    updateWindowSize();

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Copy to clipboard handler
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
          <div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 min-h-screen py-10 text-white">
        <div className="container mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold">Device Details</h2>
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            {/* User Agent */}
            <div>
              <p className="font-semibold">User Agent:</p>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm">{userAgent}</pre>
              <button
                onClick={() => copyToClipboard(userAgent)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Copy User Agent
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left mt-6">
              <p>Device Type: {deviceType}</p>
              <p>Operating System: {os}</p>
              <p>Browser: {browser}</p>
              <p>Resolution: {screenResolution}</p>
              <p>Window Size: {windowSize}</p>
              <p>Memory: {deviceMemory || "Unknown"} GB</p>
              <p>Color Depth: {colorDepth}</p>
              <p>Timezone: {timezone}</p>
              <p>Language: {language}</p>
              <p>Network: {networkInfo}</p>
              <p>Connection: {connectionType}</p>
              <p>Current Time: {currentTime}</p>
              {batteryInfo && (
                <>
                  <p>Battery: {Math.round(batteryInfo.level * 100)}%</p>
                  <p>Charging: {batteryInfo.charging ? "Yes" : "No"}</p>
                </>
              )}
            </div>

            {ipInfo && (
              <div className="mt-6">
                <h4 className="font-semibold">IP Information</h4>
                <p>IP: {ipInfo.query}</p>
                <p>Location: {ipInfo.city}, {ipInfo.regionName}, {ipInfo.country}</p>
              </div>
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
