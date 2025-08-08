import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  maxWidth = "max-w-4xl",
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-base-100 rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()} // prevent background click
      >
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
