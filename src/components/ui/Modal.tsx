import React from "react";

interface ModalTriggerProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const ModalTrigger: React.FC<ModalTriggerProps> = ({
  onClick,
  children,
  className = "",
}) => {
  return (
    <button className={`btn btn-primary ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default ModalTrigger;
