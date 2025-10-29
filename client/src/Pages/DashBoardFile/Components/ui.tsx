//@ts-nocheck
import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { CornerUpRight } from 'lucide-react';

export const Button = ({ children, onClick, variant = 'primary', className = '' }: { children: React.ReactNode, onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void, variant?: string, className?: string }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}>{children}</button>
);

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white border border-gray-100 shadow-lg  overflow-auto rounded-xl p-6 w-full  flex flex-col h-full ${className}`} style={{ scrollbarWidth: 'none' }}>
        {children}
    </div>
);

export const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`mb-4 flex-shrink-0 ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <h3 className={`text-lg font-bold text-gray-900 ${className}`}>
        {children}
    </h3>
);

export const CardDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
        {children}
    </p>
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex-1 ${className}`}>
        {children}
    </div>
);

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: number;
    unit?: string;
    color: string;
    isCurrency?: boolean;
    description?: string;
}

export const StatCard = ({ icon: Icon, title, value, unit, color, isCurrency = false, description = '' }: StatCardProps) => (
    <div className="h-full w-full">
        <Card className="flex flex-col w-full h-full contain-content contain-layout   p-4 transition-all duration-200 hover:shadow-xl  hover:scale-[1.02] ">
            <div className="flex justify-between items-start flex-1">
                <div className="flex-grow">
                    <p className="text-xs font-medium text-gray-500 mb-2">{title} </p>
                    <div className="flex items-baseline">
                        <span className={`text-xl font-extrabold text-${color}-700`}>
                            {isCurrency ? '$' : ''}{value.toLocaleString()}
                        </span>
                        {unit && <span className="ml-2 text-sm font-medium text-gray-500">{unit}</span>}
                    </div>
                    {description && (
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{description}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 flex-shrink-0 ml-4`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </Card>
    </div>
);

export const TriageAlertBanner = ({ message, isVisible, onInvestigate, AlertTriangle }: { message: string, isVisible: boolean, onInvestigate: () => void, AlertTriangle: React.ElementType }) => {
    if (!isVisible) return null;
    return (
        <div className="bg-red-50 border-l-4 animate-pulse border-red-500 p-4 mb-8 flex justify-between items-center shadow-lg rounded-md">
            <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3 animate-pulse" />
                <p className="text-sm text-red-800 font-bold">{message}</p>
            </div>
            <Button onClick={onInvestigate} className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 shadow-md">
                Investigate <CornerUpRight className='w-4 h-4 ml-1 inline-block' />
            </Button>
        </div>
    );
};

const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [ref, callback]);
};


export const SimpleCustomSelect = ({ value, onChange, options }: { 
    value: string, 
    onChange: (value: string) => void, 
    options: { name: string, value: string }[] 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(option => option.value === value)?.name || value;


    useOutsideClick(selectRef, () => {
        setIsOpen(false);
    });

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div ref={selectRef} className="relative w-full sm:w-auto">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="appearance-none block w-full p-2 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white text-sm text-left
                            transition-colors hover:border-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                            cursor-pointer"
            >
                {selectedLabel}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className={`fill-current h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                        {options.map(option => {
                            const isSelected = option.value === value;
                            return (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${isSelected ? 'font-semibold bg-indigo-100' : 'text-gray-900'}`}
                                >
                                    {option.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};