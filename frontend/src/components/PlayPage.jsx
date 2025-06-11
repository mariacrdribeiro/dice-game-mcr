import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Message from "./Message";

export default function PlayPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [fundsToAdd, setFundsToAdd] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);
  const [betType, setBetType] = useState("even");
  const [isRolling, setIsRolling] = useState(false);
  const [rolledNumber, setRolledNumber] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const clientId = localStorage.getItem("clientId");
  const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const [lastRolls, setLastRolls] = useState([]);

  useEffect(() => {
    if (!clientId) navigate("/");
    else fetchBalance();
    fetchLastRolls();
  }, [clientId]);
  const fetchLastRolls = async () => {
    try {
      const response = await fetch("http://localhost:8080/play/last-results");
      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          // When no rolls recorded yet
          setLastRolls([]);
        } else {
          setLastRolls(data);
        }
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBalance = async () => {
    try {
      const response = await fetch(`http://localhost:8080/wallet/${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(parseFloat(data.balance).toFixed(2));
        fetchLastRolls();
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to fetch balance");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  const handlePlay = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    setMessage("");
    setIsRolling(true);
    setRolledNumber(null);

    try {
      const response = await fetch("http://localhost:8080/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          amount: Number(amount),
          betType,
        }),
      });

      setIsRolling(false);

      if (response.ok) {
        const data = await response.json();
        setRolledNumber(data.diceNumber);
        setMessage(
          `🎲 Dice rolled: ${
            data.diceNumber
          }. You ${data.result.toUpperCase()}!`
        );
        setAmount("");
        fetchBalance();
      } else {
        const data = await response.json();
        setMessage(data.message || "Play failed.");
      }
    } catch (error) {
      setIsRolling(false);
      setMessage("Network error: " + error.message);
    }
  };

  const handleEndPlay = async () => {
    setMessage("Ending play...");
    try {
      const response = await fetch(
        `http://localhost:8080/endplay/${clientId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBalance(parseFloat(data.balance).toFixed(2));
        setMessage(`✅ Play ended.`);
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to end play");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  const handleAddFunds = async () => {
    if (!fundsToAdd || isNaN(fundsToAdd) || Number(fundsToAdd) <= 0) {
      setMessage("Please enter a valid amount to add.");
      return;
    }
    setMessage("Adding funds...");

    try {
      const response = await fetch("http://localhost:8080/wallet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          amount: Number(fundsToAdd),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(parseFloat(data.balance).toFixed(2));
        setFundsToAdd("");
        setMessage(`💰 Added ${fundsToAdd} € successfully!`);
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to add funds.");
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientId");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      <div className="flex w-full max-w-5xl justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">
          🎲 Dice Game — Welcome, <span className="underline">{clientId}</span>!
        </h1>
        <button
          onClick={handleLogout}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold shadow-lg transition"
          title="Switch player"
        >
          Switch Player
        </button>
      </div>
      {message && <Message message={message} onClose={() => setMessage("")} />}
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8">
        <div className="flex flex-col flex-1 bg-white text-indigo-800 rounded-lg shadow-lg p-6 relative">
          <div className="flex items-center justify-center mb-4 space-x-2">
            <h2 className="text-2xl font-bold text-center">
              Place Your Bet (X2 or Lose)
            </h2>

            <button
              aria-label="How to play"
              onClick={() => setShowTooltip(!showTooltip)}
              onBlur={() => setShowTooltip(false)}
              className="text-indigo-500 hover:text-indigo-700 focus:outline-none font-bold text-2xl leading-none select-none"
              type="button"
              tabIndex={0}
            >
              ?
            </button>
          </div>

          {showTooltip && (
            <div
              className="absolute top-16 left-6 z-30 max-w-xs p-4 bg-indigo-900 bg-opacity-95 rounded-lg shadow-lg text-white text-sm"
              onMouseLeave={() => setShowTooltip(false)}
              role="tooltip"
            >
              <p>
                Welcome to the Dice Game! Bet on <strong>Even</strong> or{" "}
                <strong>Odd</strong>. If the dice roll matches your bet, you
                double your amount. Otherwise, you lose your bet. Good luck!
              </p>
            </div>
          )}

          <div className="flex justify-center items-center mb-6">
            <div
              className={`w-32 h-32 rounded-xl bg-black text-white flex items-center justify-center text-9xl font-extrabold shadow-lg ${
                isRolling ? "animate-bounce" : ""
              }`}
              aria-live="polite"
            >
              {isRolling
                ? "🎲"
                : rolledNumber !== null
                ? diceEmojis[rolledNumber - 1]
                : "🎲"}
            </div>
          </div>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            min="0"
            step="0.01"
            inputMode="decimal"
            className="w-full mb-6 px-5 py-3 border border-indigo-300 rounded-lg shadow-sm placeholder-indigo-400
     focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:border-indigo-600 transition"
          />

          <select
            value={betType}
            onChange={(e) => setBetType(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="even">Even</option>
            <option value="odd">Odd</option>
          </select>

          <div className="flex space-x-4">
            <button
              onClick={handlePlay}
              disabled={isRolling}
              className={`flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition ${
                isRolling ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Play
            </button>
            <button
              onClick={handleEndPlay}
              disabled={isRolling}
              className={`flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition ${
                isRolling ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              End Play
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-900 rounded-lg shadow-xl p-8 max-w-sm mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-1">
              Balance
            </h2>
            <p className="text-5xl font-bold text-yellow-500 tracking-wide">
              {balance !== null ? `${balance} €` : "Loading..."}
            </p>
          </div>

          <h3 className="text-2xl font-semibold mb-5 text-center text-indigo-800 border-b border-indigo-300 pb-2">
            Add Funds
          </h3>

          <input
            type="number"
            placeholder="Amount to add"
            value={fundsToAdd}
            onChange={(e) => setFundsToAdd(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            min="0"
            step="0.01"
            inputMode="decimal"
            className="w-full mb-6 px-5 py-3 border border-indigo-300 rounded-lg shadow-sm placeholder-indigo-400
     focus:outline-none focus:ring-3 focus:ring-indigo-400 focus:border-indigo-600 transition"
          />

          <button
            onClick={handleAddFunds}
            className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg
               shadow-md transition duration-200"
          >
            Add Funds
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-yellow-900 text-center font-semibold mb-2">
          Last Rolls:
        </h3>
        <div className="flex space-x-2 overflow-x-auto">
          {lastRolls.length > 0 ? (
            lastRolls.map((roll, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-full text-white font-bold text-sm
            ${roll % 2 == 0 ? "bg-green-500" : "bg-red-500"}`}
              >
                {roll}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No rolls yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
