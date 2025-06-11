import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [activeTab, setActiveTab] = useState("register");
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const initialBalance = Number(balance) || 0;

  const handleRegister = async () => {
    if (!username) {
      setMessage("Please enter a username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: username, balance: initialBalance }),
      });

      if (response.ok) {
        localStorage.setItem("clientId", username);
        setMessage("");
        navigate("/play");
      } else {
        const data = await response.json();
        console.log(data.message);
        if (data.message === "player already exists") {
          setMessage("Player already exists. Please Login");
        } else {
          setMessage(data.message || "Registration failed");
        }
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  const handleLogin = async () => {
    if (!username) {
      setMessage("Please enter a username.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/wallet/${username}`);

      if (response.ok) {
        localStorage.setItem("clientId", username);
        setMessage("");
        navigate("/play");
      } else if (response.status === 404) {
        setMessage("User does not exist. Please register first.");
      } else {
        setMessage("Error checking user existence.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex">
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <h1 className="text-white text-7xl font-extrabold mb-6 text-center">
          Welcome to Dice Game!
        </h1>
        <p className="text-white text-xl max-w-md text-center">
          A thrilling multiplayer experience powered by Go and React. Roll the
          dice and beat your friends!
        </p>
      </div>

      <div className="w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <div className="relative flex mb-4 rounded-xl overflow-hidden bg-indigo-100">
            <div
              className="absolute top-0 bottom-0 w-1/2 bg-white rounded-xl shadow transition-transform duration-300 ease-in-out"
              style={{
                transform:
                  activeTab === "register"
                    ? "translateX(0%)"
                    : "translateX(100%)",
              }}
            />

            <button
              onClick={() => setActiveTab("register")}
              className={`relative flex-1 px-4 py-2 font-semibold text-indigo-600 transition-colors duration-300 ${
                activeTab === "register"
                  ? "text-indigo-600"
                  : "text-indigo-700 hover:text-indigo-900"
              }`}
            >
              Register
            </button>

            <button
              onClick={() => setActiveTab("login")}
              className={`relative flex-1 px-4 py-2 font-semibold text-indigo-600 transition-colors duration-300 ${
                activeTab === "login"
                  ? "text-indigo-600"
                  : "text-indigo-700 hover:text-indigo-900"
              }`}
            >
              Login
            </button>
          </div>

          <div
            key={activeTab}
            className="space-y-4 transition-opacity duration-300 ease-in-out"
            style={{ opacity: 1 }}
          >
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-indigo-600 font-semibold focus:outline-none border border-indigo-600"
            />

            {activeTab === "register" && (
              <input
                type="number"
                placeholder="Enter balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-indigo-600 font-semibold focus:outline-none border border-indigo-600"
              />
            )}

            <button
              onClick={activeTab === "register" ? handleRegister : handleLogin}
              className="w-full px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              {activeTab === "register" ? "Register" : "Login"}
            </button>

            {message && (
              <p className="text-red-400 text-center text-sm">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
