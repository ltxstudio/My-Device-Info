import { useEffect, useState } from "react";
import axios from "axios";
import { FaDesktop, FaMobileAlt, FaMoon, FaSun, FaWifi } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import { isMobile, isTablet, browserName, osName } from "react-device-detect";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    os: "",
    deviceType: "",
    browser: "",
    screenResolution: "",
    timezone: "",
    language: "",
    connectionType: "",
    networkInfo: "",
    windowSize: "",
    deviceMemory: "",
    colorDepth: "",
    cpuCores: "",
    batteryInfo: null,
  });
  const [ipInfo, setIpInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("isDarkMode")) || false
  );

  useEffect(() => {
    // Set device details
    setDeviceInfo({
      userAgent: navigator.userAgent,
      os: osName,
      deviceType: isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop",
      browser: browserName,
      screenResolution: `${window.screen.width} x ${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language || navigator.userLanguage,
      connectionType: navigator.onLine ? "Online" : "Offline",
      networkInfo: navigator.connection
        ? `Type: ${navigator.connection.effectiveType || "Unknown"}, Downlink: ${
            navigator.connection.downlink || "Unknown"
          } Mbps, RTT: ${navigator.connection.rtt || "Unknown"} ms`
        : "Not Available",
      windowSize: `${window.innerWidth} x ${window.innerHeight}`,
      deviceMemory: navigator.deviceMemory || "Unknown",
      colorDepth: `${window.screen.colorDepth}-bit`,
      cpuCores: navigator.hardwareConcurrency || "Unknown",
    });

    // Fetch IP details
    axios
      .get("https://ip-api.com/json")
      .then((res) => setIpInfo(res.data))
      .catch(() => setIpInfo(null));

    // Get battery info
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) =>
        setDeviceInfo((prev) => ({
          ...prev,
          batteryInfo: {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
          },
        }))
      );
    }

    // Update window size dynamically
    const handleResize = () =>
      setDeviceInfo((prev) => ({
        ...prev,
        windowSize: `${window.innerWidth} x ${window.innerHeight}`,
      }));
    window.addEventListener("resize", handleResize);

    // Update time dynamically
    const interval = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("isDarkMode", JSON.stringify(newMode));
  };

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to Clipboard!"));
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Helmet>
        <title>Device Info Hub</title>
      </Helmet>

      {/* Header */}
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

      {/* Main Content */}
      <main className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 min-h-screen py-10 text-white">
        <div className="container mx-auto text-center space-y-10">
          <h2 className="text-4xl font-bold">Device Details</h2>

          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(deviceInfo).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.replace(/([A-Z])/g, " $1")}: </strong>
                  {typeof value === "object" ? (
                    <span>
                      {value.level}% ({value.charging ? "Charging" : "Not Charging"})
                    </span>
                  ) : (
                    <span>{value || "Fetching..."}</span>
                  )}
                </p>
              ))}
              {ipInfo ? (
                <>
                  <p>
                    <strong>IP Address:</strong> {ipInfo.query}
                  </p>
                  <p>
                    <strong>Location:</strong> {ipInfo.city}, {ipInfo.regionName}, {ipInfo.country}
                  </p>
                  <p>
                    <strong>ISP:</strong> {ipInfo.isp}
                  </p>
                </>
              ) : (
                <p>Loading IP Information...</p>
              )}
              <p>
                <strong>Current Time:</strong> {currentTime}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
