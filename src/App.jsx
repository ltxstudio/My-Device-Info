import { useEffect, useState } from "react";
import axios from "axios";
import { FaDesktop, FaMobileAlt, FaCode, FaWifi, FaGlobeAmericas, FaBatteryThreeQuarters } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { Helmet } from "react-helmet";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import { isMobile, isTablet, browserName, osName } from "react-device-detect";

import "react-toastify/dist/ReactToastify.css";

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
  const [cpuInfo, setCpuInfo] = useState("");
  const [screenOrientation, setScreenOrientation] = useState("");
  const [deviceMemory, setDeviceMemory] = useState("");

  useEffect(() => {
    const agent = navigator.userAgent;
    setUserAgent(agent);
    setDeviceType(isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop");
    setOs(osName);
    setBrowser(browserName);

    axios
      .get("http://ip-api.com/json")
      .then((response) => setIpInfo(response.data))
      .catch((error) => console.error("Error fetching IP info:", error));

    setScreenResolution(`${window.screen.width} x ${window.screen.height}`);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setLanguage(navigator.language || navigator.userLanguage);

    if (navigator.connection) {
      setNetworkInfo(navigator.connection.effectiveType);
    } else {
      setNetworkInfo("Not Available");
    }

    setConnectionType(navigator.onLine ? "Online" : "Offline");

    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => setBatteryInfo(battery));
    }

    if (navigator.hardwareConcurrency) {
      setCpuInfo(navigator.hardwareConcurrency);
    }

    if (window.screen.orientation) {
      setScreenOrientation(window.screen.orientation.type);
    }

    if (navigator.deviceMemory) {
      setDeviceMemory(navigator.deviceMemory);
    }
  }, []);

  const handleCopyUserAgent = () => {
    navigator.clipboard.writeText(userAgent);
    toast.success("User Agent Copied to Clipboard!");
  };

  return (
    <div>
      <Helmet>
        <title>Device Info Hub</title>
        <meta name="description" content="Check your device, browser, and network details easily." />
        <meta name="keywords" content="Device Info, User Agent, Browser Info, IP Info, Responsive Design" />
        <meta name="author" content="Your Name" />
      </Helmet>

      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Device Info Hub</h1>
          <nav>
            <a href="#features" className="mx-2 hover:text-gray-200">
              Features
            </a>
            <a href="#info" className="mx-2 hover:text-gray-200">
              Info
            </a>
            <a href="#footer" className="mx-2 hover:text-gray-200">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 min-h-screen py-10">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">Explore Your Device Details</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Your Device Information</h3>

            {/* User Agent Info */}
            <div className="flex justify-center items-center space-x-4">
              <div className="text-blue-500 text-4xl">
                <IoMdPlanet />
              </div>
              <div>
                <p className="font-semibold text-gray-700">User Agent:</p>
                <pre className="text-sm text-gray-500">{userAgent}</pre>
                <button
                  onClick={handleCopyUserAgent}
                  data-tip="Click to copy the User Agent"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                  Copy User Agent
                </button>
              </div>
            </div>

            {/* Other Device Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-left text-gray-700">
              <div className="flex items-center space-x-2">
                <FaDesktop className="text-blue-500" />
                <p>{deviceType}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCode className="text-purple-500" />
                <p>{os}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaWifi className="text-green-500" />
                <p>{browser}</p>
              </div>
              <div>
                <p>Resolution: {screenResolution}</p>
              </div>
              <div>
                <p>Language: {language}</p>
              </div>
              <div>
                <p>Memory: {deviceMemory} GB</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 Device Info Hub. All rights reserved.</p>
          <p>Contact us at: info@example.com</p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default App;
