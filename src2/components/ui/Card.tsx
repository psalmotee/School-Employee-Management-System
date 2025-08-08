import React from "react";

export const Card = ({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`card bg-base-100 shadow-md rounded-box border border-base-300 ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`card-title text-xl font-bold p-4 border-b border-base-300 ${className}`}
  >
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-lg font-semibold ${className}`}>{children}</div>
);

export const CardContent = ({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`card-body p-4 ${className}`}>{children}</div>
);
