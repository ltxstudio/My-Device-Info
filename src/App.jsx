import { useEffect, useState } from "react";
import axios from "axios";
import { FaDesktop, FaMobileAlt, FaCode, FaWifi } from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { HiDevicePhone } from "react-icons/hi";

function App() {
  const [userAgent, setUserAgent] = useState("");
  const [os, setOs] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [screenResolution, setScreenResolution] = useState("");
  const [browser, setBrowser] = useState("");

  useEffect(() => {
    // Get the user agent string from the browser
    const agent = navigator.userAgent;
    setUserAgent(agent);

    // Detect device type (Mobile/Desktop)
    if (/mobile/i.test(agent)) {
      setDeviceType("Mobile");
    } else {
      setDeviceType("Desktop");
    }

    // Detect OS from the user agent string
    if (/Windows NT/i.test(agent)) {
      setOs("Windows");
    } else if (/Mac OS/i.test(agent)) {
      setOs("MacOS");
    } else if (/Linux/i.test(agent)) {
      setOs("Linux");
    } else {
      setOs("Unknown OS");
    }

    // Detect Browser from user agent string
    if (/chrome|chromium|crios/i.test(agent)) {
      setBrowser("Google Chrome");
    } else if (/firefox|fxios/i.test(agent)) {
      setBrowser("Mozilla Firefox");
    } else if (/safari/i.test(agent) && !/chrome/i.test(agent)) {
      setBrowser("Safari");
    } else if (/edge/i.test(agent)) {
      setBrowser("Microsoft Edge");
    } else {
      setBrowser("Unknown Browser");
    }

    // Fetch IP info using ip-api service
    axios.get("http://ip-api.com/json")
      .then(response => {
        setIpInfo(response.data);
      })
      .catch(error => console.error("Error fetching IP info:", error));

    // Set screen resolution
    setScreenResolution(`${window.screen.width} x ${window.screen.height}`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">What Is My User Agent?</h1>

        <div className="flex justify-center items-center space-x-4">
          <div className="text-blue-500 text-4xl">
            <IoMdPlanet />
          </div>
          <div className="text-gray-600 text-xl">
            <p className="font-semibold">User Agent Info:</p>
            <pre className="text-sm text-gray-500">{userAgent}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <FaDesktop className="text-blue-500" />
              <p>{deviceType} Device</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <FaCode className="text-purple-500" />
              <p>{os} OS</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <FaWifi className="text-green-500" />
              <p>{browser} Browser</p>
            </div>
          </div>

          <div className="text-lg text-gray-700 font-semibold">
            <p>Screen Resolution: <span className="font-normal">{screenResolution}</span></p>
          </div>

          <div className="text-lg text-gray-700 font-semibold">
            {ipInfo ? (
              <div>
                <p>IP Address: <span className="font-normal">{ipInfo.query}</span></p>
                <p>Location: <span className="font-normal">{ipInfo.city}, {ipInfo.country}</span></p>
                <p>ISP: <span className="font-normal">{ipInfo.isp}</span></p>
              </div>
            ) : (
              <p>Loading IP Info...</p>
            )}
          </div>
        </div>

        <div className="space-x-4 flex justify-center">
          <button
            onClick={() => alert("You can copy the user agent or inspect it further.")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Copy User Agent
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
