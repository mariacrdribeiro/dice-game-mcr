import React, { useEffect } from "react";

export default function Message({ message, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed top-4 right-4 max-w-xs bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fadeIn"
      style={{ animationDuration: "300ms" }}
    >
      <div className="flex justify-between items-center">
        <p className="mr-4">{message}</p>
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="text-white hover:text-indigo-300 font-bold text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
