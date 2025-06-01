import React, { useEffect, useRef } from 'react';

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Dropdown: React.FC<DropdownProps> & {
  Item: React.FC<{children: React.ReactNode}>;
  Header: React.FC<{children: React.ReactNode, className?: string}>;
  Divider: React.FC;
} = ({ children, className = "", onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && onClose) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={dropdownRef}
      className={`absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

Dropdown.Item = ({ children }) => (
  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
    {children}
  </button>
);

Dropdown.Header = ({ children, className = "" }) => (
  <div className={`px-4 py-2 text-sm font-medium ${className}`}>
    {children}
  </div>
);

Dropdown.Divider = () => (
  <div className="border-t border-gray-200 my-1"></div>
);

export default Dropdown;