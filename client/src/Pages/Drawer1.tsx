import { X } from "lucide-react";
import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title = "Details",
  children,
  width = "32rem",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 " 
      onClick={onClose}
    >
      <div
        className="fixed top-0 right-0 h-full bg-white rounded-l-lg shadow-lg flex flex-col"
        style={{
          width: width
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="sticky top-0 z-20 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;