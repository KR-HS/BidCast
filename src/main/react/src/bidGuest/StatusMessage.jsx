// StatusMessage.jsx
import React from "react";

const StatusMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="status-popup">
            {message}
        </div>
    );
};

export default StatusMessage;
