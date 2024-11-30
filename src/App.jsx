import { useEffect, useState } from "react";
import axios from "axios";
import { FaDesktop, FaMobileAlt, FaCode, FaWifi, FaGlobeAmericas, FaBatteryThreeQuarters } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import { isMobile, isTablet, browserName, osName } from "react-device-detect";

import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Import additional custom CSS

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

  useEffect(() => {
    // Fetch basic device info
    setUserAgent(navigator.userAgent);
    setDeviceType(isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop");
    setOs(osName);
    setBrowser(browserName);
    setScreenResolution(`${window.screen.width} x ${window.screen.height}`);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setLanguage(navigator.language || navigator.userLanguage);

    // Fetch IP info
    axios
      .get("http://ip-api.com/json")
      .then((response) => setIpInfo(response.data))
      .catch((error) => console.error("Error fetching IP info:", error));

    // Network information
    if (navigator.connection) {
      setNetworkInfo(navigator.connection.effectiveType);
    } else {
      setNetworkInfo("Not Available");
    }

    // Connection status
    setConnectionType(navigator.onLine ? "Online" : "Offline");

    // Battery information
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => setBatteryInfo(battery));
    }

    // Device memory
    if (navigator.deviceMemory) {
      setDeviceMemory(navigator.deviceMemory);
    }

    // Update window size dynamically
    const updateWindowSize = () => setWindowSize(`${window.innerWidth} x ${window.innerHeight}`);
    window.addEventListener("resize", updateWindowSize);
    updateWindowSize(); // Initial call

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Handle copy user agent to clipboard
  const handleCopyUserAgent = () => {
    navigator.clipboard.writeText(userAgent);
    toast.success("User Agent Copied to Clipboard!");
  };

  return (
    <div>
      <Helmet>
        <title>Device Info Hub</title>
        <meta name="description" content="Easily view detailed device, browser, and network information." />
        <meta name="keywords" content="Device Info, User Agent, IP, Responsive Design" />
        <meta name="author" content="Your Name" />
      </Helmet>

      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Device Info Hub</h1>
          <nav className="space-x-4">
            <a href="#features" className="hover:text-gray-200">
              Features
            </a>
            <a href="#info" className="hover:text-gray-200">
              Info
            </a>
            <a href="#footer" className="hover:text-gray-200">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 min-h-screen py-10 text-white">
        <div className="container mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold">Your Device Details at a Glance</h2>

          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Device Information</h3>

            {/* User Agent */}
            <div className="mb-6">
              <p className="font-semibold">User Agent:</p>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm">{userAgent}</pre>
              <button
                onClick={handleCopyUserAgent}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Copy User Agent
              </button>
            </div>

            {/* Device and Network Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <p>Device Type: {deviceType}</p>
              <p>Operating System: {os}</p>
              <p>Browser: {browser}</p>
              <p>Screen Resolution: {screenResolution}</p>
              <p>Window Size: {windowSize}</p>
              <p>Language: {language}</p>
              <p>Timezone: {timezone}</p>
              <p>Network Type: {networkInfo}</p>
              <p>Connection: {connectionType}</p>
              <p>Memory: {deviceMemory} GB</p>
              {batteryInfo && (
                <>
                  <p>Battery Level: {Math.round(batteryInfo.level * 100)}%</p>
                  <p>Charging: {batteryInfo.charging ? "Yes" : "No"}</p>
                </>
              )}
            </div>

            {/* IP Info */}
            {ipInfo ? (
              <div className="mt-6">
                <h4 className="font-semibold">IP Information</h4>
                <p>IP Address: {ipInfo.query}</p>
                <p>Location: {ipInfo.city}, {ipInfo.regionName}, {ipInfo.country}</p>
                <p>Latitude: {ipInfo.lat}, Longitude: {ipInfo.lon}</p>
              </div>
            ) : (
              <p>Loading IP info...</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center space-y-2">
          <p>© 2024 Device Info Hub. All rights reserved.</p>
          <p>
            Contact:{" "}
            <a href="mailto:info@example.com" className="underline text-blue-400">
              info@example.com
            </a>
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default App;
