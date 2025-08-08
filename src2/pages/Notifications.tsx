"use client";

import type React from "react";

const Notifications: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <div className="bg-base-100 shadow-lg rounded-lg p-6 text-center">
        <p className="text-lg text-base-content/80">
          This section will display your recent notifications.
        </p>
        <p className="text-sm text-base-content/60 mt-2">(Coming Soon!)</p>
      </div>
    </div>
  );
};

export default Notifications;
