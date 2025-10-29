import { registerables, type ChartData, ChartConfiguration } from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import type { JSX } from "react";
import { Shield, LineChart, Building, AlertTriangle, CheckCircle, TrendingUp, Clock, AlertCircle, RefreshCw, Calendar, UserCheck, UserX, AppWindow, Activity, Wifi, ShieldCheck, } from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Chart } from "chart.js";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import SideBar from "../Components/SideBar";

Chart.register(...registerables);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
interface MapDatas {
    name: string;
    coordinates: number[];
    users: number;
    color: string;
}


// Enhanced Type definitions
interface Stat {
    title: string;
    value: string;
    icon: JSX.Element;
    color: string;
    description: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

interface Application {
    id: number;
    name: string;
    category: string;
    users: number;
    status: "success" | "warning" | "error" | "suspended";
    usage: number;
    responseTime: string;
    alerts: number;
    uptime: number;
}



interface Widget {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
}

export default function Dashboard2(): JSX.Element {
    const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleTimeString());
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isCustomizeOpen, setIsCustomizOpen] = useState<boolean>(false);

    const [hiddenWidgets, setHiddenWidgets] = useState<Set<string>>(new Set());
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });


    const toggleCustomize = () => {
        setIsCustomizOpen(!isCustomizeOpen);
    }

    // Toggle widget visibility
    const toggleWidgetVisibility = (widgetId: string) => {
        setHiddenWidgets(prevHiddenWidgets => {
            const newHiddenWidgets = new Set(prevHiddenWidgets);
            if (newHiddenWidgets.has(widgetId)) {
                newHiddenWidgets.delete(widgetId);
            } else {
                newHiddenWidgets.add(widgetId);
            }
            return newHiddenWidgets;
        });
    };

    // Helper to check if a widget should be visible
    const isWidgetVisible = (widgetId: string) => {
        return !hiddenWidgets.has(widgetId);
    }

    // Simulate real-time data refresh
    const refreshData = () => {
        setIsRefreshing(true);
        // Simulate API call delay
        setTimeout(() => {
            setLastRefresh(new Date().toLocaleTimeString());
            setIsRefreshing(false);
            //
        }, 1500);
    };

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Effect to handle 'Escape' key press for closing the modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsCustomizOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Enhanced stats for SSO School Application
    const stats: Stat[] = [
        {
            title: "Total Active Users",
            value: "8,420", // Corrected value
            icon: <UserCheck className="h-6 w-6" />,
            color: "bg-green-500",
            description: "Currently logged in",
            trend: { value: "+5%", isPositive: true }
        },
        {
            title: "User Environment",
            value: "45 Schools",
            icon: <Building className="h-6 w-6" />,
            color: "bg-blue-500",
            description: "Active tenants",
            trend: { value: "+12%", isPositive: true }
        },
        {
            title: "Total Active Apps",
            value: "28",
            icon: <AppWindow className="h-6 w-6" />,
            color: "bg-indigo-500",
            description: "Running applications",
            trend: { value: "+3%", isPositive: true }
        },
        {
            title: "Inactive Apps",
            value: "5",
            icon: <AppWindow className="h-6 w-6" />,
            color: "bg-yellow-500",
            description: "Needs attention",
            trend: { value: "-2%", isPositive: true }
        },
        {
            title: "Suspicious Activity",
            value: "12",
            icon: <AlertCircle className="h-6 w-6" />,
            color: "bg-red-500",
            description: "Security alerts",
            trend: { value: "+8%", isPositive: false }
        },
        {
            title: "Total users across all tenants",
            value: "15,000",
            icon: <UserCheck className="h-6 w-6" />,
            color: "bg-purple-500",
            description: "Aggregated user count",
            trend: { value: "+15%", isPositive: true }
        },
        {
            title: "Active Session",
            value: "5",
            icon: <Wifi className="h-6 w-6" />,
            color: "bg-orange-500",
            description: "Active Users (current logged-in)",
            trend: { value: "+2%", isPositive: true }
        }, {
            title: "Registered",
            value: "10",
            icon: <Building className="h-6 w-6" />,
            color: "bg-blue-500",
            description: "Total number of tenants registered",
            trend: { value: "+5%", isPositive: true }
        },
        {
            title: "Total No of applications ",
            value: "10",
            icon: <AppWindow className="h-6 w-6" />,
            color: "bg-indigo-500",
            description: "Total number of applications",
            trend: { value: "+5%", isPositive: true }
        }
    ];

    // Provider Success Rate Data
    const providerSuccessRateData: ChartData<'doughnut'> = useMemo(() => ({
        labels: ['GoogleOAuth', 'MicrosoftOAuth', 'GoogleSAML', 'Other'],
        datasets: [
            {
                data: [99.2, 98.7, 97.5, 95.8],
                backgroundColor: [
                    '#4285F4', // Google Blue
                    '#00A4EF', // Microsoft Blue
                    '#E44D2E', // AD Orange
                    '#8B5CF6', // Purple
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],
    }), []);

    // Mock applications data graph
    const applications: Application[] = [
        { id: 1, name: "Student Portal", category: "Education", users: 5000, status: "success", usage: 85, responseTime: "120ms", alerts: 2, uptime: 99.9 },
        { id: 2, name: "Library System", category: "Education", users: 3000, status: "warning", usage: 60, responseTime: "250ms", alerts: 5, uptime: 98.5 },
        { id: 3, name: "Gradebook", category: "Education", users: 4200, status: "error", usage: 40, responseTime: "450ms", alerts: 12, uptime: 95.0 },
        { id: 4, name: "Email System", category: "Communication", users: 2500, status: "warning", usage: 75, responseTime: "200ms", alerts: 3, uptime: 99.0 },
    ];

    const appData: ChartData<'bar'> = useMemo(() => ({
        labels: applications.map(app => app.name),
        datasets: [
            {
                label: 'Users',
                data: applications.map(app => app.users),
                backgroundColor: 'rgba(99, 102, 241, 0.8)', // A consistent indigo color
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
                barThickness: 30, // Sets a fixed bar width
                maxBarThickness: 40, // Ensures bars don't get too wide
            },
        ],
    }), [applications]);

    // Application Alerts Chart
    const applicationAlertsData: ChartData<'bar'> = {
        labels: ['Student Portal', 'Library', 'Gradebook', 'Email', 'LMS', 'HR'],
        datasets: [
            {
                label: 'Alerts',
                data: [2, 5, 8, 12, 3, 1],
                backgroundColor: '#FF6347',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                barThickness: 20,
                maxBarThickness: 40,
            },
            {
                label: 'Warnings',
                data: [5, 3, 6, 4, 2, 1],
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1,
                barThickness: 30,
                maxBarThickness: 40,
            },
        ],
    };

    // most used authentication mode in a donut 
    const authData: ChartData<'doughnut'> = {
        labels: ['GoogleOAuth', 'MicrosoftOAuth', 'GoogleSAML', 'Other'],
        datasets: [
            {
                data: [89.2, 78.7, 67.5, 95.8],
                backgroundColor: [
                    '#4285F4', // Google Blue
                    '#00A4EF', // Microsoft Blue
                    '#E44D2E', // AD Orange
                    '#8B5CF6', // Purple
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],

    }
    // Error and Success Rate Over Time
    const errorSuccessRateData: ChartData<'line'> = {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        datasets: [
            {
                label: "Success Rate %",
                yAxisID: 'y',
                data: [98.5, 99.2, 98.8, 99.5, 99.1, 98.9],
                borderColor: "rgba(34, 197, 94, 1)",
                // sucess and error
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                tension: 0.4,
                fill: true,

            },
            {
                label: "Error Rate %",
                data: [2.5, 10.8, 11.2, 12.5, 3.9, 2.1],
                borderColor: "rgba(239, 68, 68, 1)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.4,
                fill: true,
                yAxisID: 'y1',
            },
        ],
    };

    // Portal Usage by Role
    const portalUsageByRoleData: ChartData<'line'> = {
        labels: ['Student', 'Teacher', 'Admin', 'Parent', 'Staff'],
        datasets: [
            {
                label: 'Portal Usage',
                data: [85, 92, 78, 65, 70],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
            },
            {
                label: 'Feature Access',
                data: [60, 85, 95, 45, 75],
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2,
            },
        ],
    };


    // Service Provider Expiry Data
    const providerExpiryData = [
        { id: 1, provider: "Google", expiryDate: "2024-12-31", status: "active", daysLeft: 350 },
        { id: 2, provider: "Microsoft", expiryDate: "2024-06-15", status: "expiring", daysLeft: 150 },
        { id: 3, provider: "Active Directory", expiryDate: "2024-03-30", status: "expiring", daysLeft: 75 },
        { id: 4, provider: "SAML", expiryDate: "2024-01-20", status: "expired", daysLeft: -5 },
    ];

    // User Role Expiry Data
    const userRoleExpiryData = [
        { id: 1, user: "John Doe", role: "Admin", expiryDate: "2024-12-31", status: "active", method: "Google", daysLeft: 350, },
        { id: 2, user: "Jane Smith", role: "Teacher", expiryDate: "2024-03-15", status: "expiring", method: "Microsoft", daysLeft: 150, },
        { id: 3, user: "Bob Brown", role: "Student", expiryDate: "2024-02-28", status: "expiring", method: "Active Directory", daysLeft: 75, },
        { id: 4, user: "Alice Johnson", role: "Parent", expiryDate: "2024-01-10", status: "expired", method: "SAML", daysLeft: -5, },
    ];

    // tenats data in bar graph top 5 only
    const topTenants: ChartData<'bar'> = {
        labels: ['Springfield High', 'Lincoln Elementary', 'Washington District', 'Jefferson Academy', 'Adams School'],
        datasets: [
            {
                label: 'Success Rate',
                data: [99.2, 68.7, 67.5, 65.8, 79.1],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
                barThickness: 30,
                maxBarThickness: 40,
            },
        ],
    }


    const getStatusColor = (status: string) => {
        switch (status) {
            case "success": return "bg-green-100 text-green-800 border-green-200";
            case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "error": return "bg-red-100 text-red-800 border-red-200";
            case "active": return "bg-green-100 text-green-800 border-green-200";
            case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
            case "expiring": return "bg-orange-100 text-orange-800 border-orange-200";
            case "expired": return "bg-red-100 text-red-800 border-red-200";
            case "suspended": return "bg-purple-100 text-purple-800 border-purple-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getProviderColor = (provider: string) => {
        switch (provider) {
            case "google": return "bg-blue-500";
            case "microsoft": return "bg-green-500";
            case "ad": return "bg-orange-500";
            default: return "bg-purple-500";
        }
    };

    const availableWidgets: Widget[] = [
        { id: 'providerSuccessRate', title: 'Provider Success Rate', description: 'Authentication success rates', icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
        { id: 'appUsage', title: 'Application Usage', description: 'Key metrics for top applications', icon: <AppWindow className="h-5 w-5 text-indigo-500" /> },
        { id: 'authMode', title: 'Most Used Auth Mode', description: 'Authentication details', icon: <ShieldCheck className="h-5 w-5 text-green-500" /> },
        { id: 'providerExpiry', title: 'Service Provider Expiry', description: 'Upcoming certificate expirations', icon: <Calendar className="h-5 w-5 text-orange-500" /> },
        { id: 'userRoleExpiry', title: 'User Role Expiry', description: 'User roles nearing expiration', icon: <UserX className="h-5 w-5 text-red-500" /> },
        { id: 'portalUsage', title: 'Portal Usage by Role', description: 'Usage patterns across roles', icon: <Activity className="h-5 w-5 text-indigo-500" /> },
        { id: 'errorSuccessRate', title: 'Error & Success Rate', description: '24h auth success/failure trends', icon: <LineChart className="h-5 w-5 text-green-500" /> },
        { id: 'tenants', title: 'Tenants', description: 'Tenant Management', icon: <Building className="h-5 w-5 text-green-500" /> },
        { id: 'appAlerts', title: 'Application Alerts', description: 'Active alerts and warnings', icon: <AlertTriangle className="h-5 w-5 text-red-500" /> },
        { id: 'tenantDistribution', title: 'Global Tenant Distribution', description: 'Geographic location of tenants', icon: <Building className="h-5 w-5 text-blue-500" /> },
        { id: 'LeastUsed', title: "Least Used", description: "Least Used Applications", icon: <UserX className="h-5 w-5 text-red-500" /> }
    ];

    // least used application 
    const leastUsedApplications = [
        { id: 1, name: "Student Portal", category: "Education", users: "John Deo", status: "Warning", usage: "50", },
        { id: 2, name: "Library System", category: "Education", users: "Lisa", status: "Warning", usage: "60", },
        { id: 3, name: "Gradebook", category: "Education", users: "Mary", status: "Higly Low", usage: "10", }
    ]
    const getLeastUsedColor = (status: string) => {
        switch (status) {
            case "Warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Higly Low": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    }

    // const tenantDistributionData = {
    //     "AF": 16.63, "AL": 11.58, "DZ": 158.97, "AO": 85.81, "AG": 1.1, "AR": 351.02, "AM": 8.83, "AU": 1219.72,
    //     "AT": 366.26, "AZ": 52.17, "BS": 7.54, "BH": 21.73, "BD": 105.4, "BB": 3.96, "BY": 52.89, "BE": 461.33,
    //     "BZ": 1.43, "BJ": 6.49, "BT": 1.4, "BO": 19.18, "BA": 16.2, "BW": 12.5, "BR": 2023.53, "BN": 11.96,
    //     "BG": 44.84, "BF": 8.67, "BI": 1.47, "KH": 11.36, "CM": 21.88, "CA": 1563.66, "CV": 1.57, "CF": 2.11,
    //     "TD": 7.59, "CL": 199.18, "CN": 5745.13, "CO": 283.11, "KM": 0.56, "CD": 12.6, "CG": 11.88, "CR": 35.02,
    //     "CI": 22.38, "HR": 59.92, "CY": 22.75, "CZ": 195.23, "DK": 304.56, "DJ": 1.14, "DM": 0.38, "DO": 50.87,
    //     "EC": 61.49, "EG": 216.83, "SV": 21.8, "GQ": 14.55, "ER": 2.25, "EE": 19.22, "ET": 30.94, "FJ": 3.15,
    //     "FI": 231.98, "FR": 2555.44, "GA": 12.56, "GM": 1.04, "GE": 11.23, "DE": 3305.9, "GH": 18.06, "GR": 305.01,
    //     "GD": 0.65, "GT": 40.77, "GN": 4.34, "GW": 0.83, "GY": 2.2, "HT": 6.5, "HN": 15.34, "HK": 226.49,
    //     "HU": 132.28, "IS": 12.77, "IN": 1430.02, "ID": 695.06, "IR": 337.9, "IQ": 84.14, "IE": 204.14, "IL": 201.25,
    //     "IT": 2036.69, "JM": 13.74, "JP": 5390.9, "JO": 27.13, "KZ": 129.76, "KE": 32.42, "KI": 0.15, "KR": 986.26,
    //     "KW": 117.32, "KG": 4.44, "LA": 6.34, "LV": 23.39, "LB": 39.15, "LS": 1.8, "LR": 0.98, "LY": 77.91,
    //     "LT": 35.73, "LU": 52.43, "MK": 9.58, "MG": 8.33, "MW": 5.04, "MY": 218.95, "MV": 1.43, "ML": 9.08,
    //     "MT": 7.8, "MR": 3.49, "MU": 9.43, "MX": 1004.04, "MD": 5.36, "MN": 5.81, "ME": 3.88, "MA": 91.7,
    //     "MZ": 10.21, "MM": 35.65, "NA": 11.45, "NP": 15.11, "NL": 770.31, "NZ": 138, "NI": 6.38, "NE": 5.6,
    //     "NG": 206.66, "NO": 413.51, "OM": 53.78, "PK": 174.79, "PA": 27.2, "PG": 8.81, "PY": 17.17, "PE": 153.55,
    //     "PH": 189.06, "PL": 438.88, "PT": 223.7, "QA": 126.52, "RO": 158.39, "RU": 1476.91, "RW": 5.69, "WS": 0.55,
    //     "ST": 0.19, "SA": 434.44, "SN": 12.66, "RS": 38.92, "SC": 0.92, "SL": 1.9, "SG": 217.38, "SK": 86.26,
    //     "SI": 46.44, "SB": 0.67, "ZA": 354.41, "ES": 1374.78, "LK": 48.24, "KN": 0.56, "LC": 1, "VC": 0.58,
    //     "SD": 65.93, "SR": 3.3, "SZ": 3.17, "SE": 444.59, "CH": 522.44, "SY": 59.63, "TW": 426.98, "TJ": 5.58,
    //     "TZ": 22.43, "TH": 312.61, "TL": 0.62, "TG": 3.07, "TO": 0.3, "TT": 21.2, "TN": 43.86, "TR": 729.05,
    //     "TM": 0, "UG": 17.12, "UA": 136.56, "AE": 239.65, "GB": 2258.57, "US": 14624.18, "UY": 40.71, "UZ": 37.72,
    //     "VU": 0.72, "VE": 285.21, "VN": 101.99, "YE": 30.02, "ZM": 15.69, "ZW": 5.57
    // };
    const tenantDistributionData:MapDatas[] =[
        { name: "New York", coordinates: [-74.0060, 40.7128], users: 500, color: "#3b82f6" },
    { name: "London", coordinates: [-0.1278, 51.5074], users: 320, color: "#10b981" },
    { name: "Tokyo", coordinates: [139.6917, 35.6895], users: 450, color: "#f59e0b" },
    { name: "São Paulo", coordinates: [-46.6333, -23.5505], users: 280, color: "#a855f7" },
    { name: "Sydney", coordinates: [151.2093, -33.8688], users: 180, color: "#ef4444" },
    ]

    const maxVal = Math.max(...tenantDistributionData.map(data => data.users));
    const colorScale = scaleLinear<string>()
        .domain([0, maxVal])
        .range(['#C8EEFF', '#0071A4']);

    return (
        <div className="min-h-screen flex  bg-gray-100">
            
            <div className="container mx-auto p-4 sm:p-6 space-y-6">
                {/* Header with Refresh Controls */}
                <div className="flex flex-col flex-wrap lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">SSO Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">School Single Sign-On Management Portal</p>
                    </div>
                    <div className=" flex flex-col md:flex-row sm:flex-row lg:flex-row items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-2  bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                            <button className="cursor-pointer" onClick={toggleCustomize}>Customize</button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            Last refresh: {lastRefresh}
                        </div>
                        <button
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                    </div>
                </div>
                
                {/* Customize Modal */}
                <div className={`fixed inset-0 z-50 transition-opacity ${isCustomizeOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-black/50" onClick={toggleCustomize}></div>
                    <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transition-transform transform ${isCustomizeOpen ? 'translate-x-0' : 'translate-x-full'}`}>


                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                                <h3 className="text-xl font-semibold">Customize Dashboard</h3>
                                <button onClick={toggleCustomize} className="text-gray-500 hover:text-gray-800">x</button>
                            </div>
                            <div className="p-6 space-y-4">
                                {availableWidgets.map((widget) => (
                                    <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            {widget.icon}
                                            <div>
                                                <h4 className="font-semibold">{widget.title}</h4>
                                                <p className="text-sm text-gray-500">{widget.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleWidgetVisibility(widget.id)}
                                            className={`px-4 py-2 text-sm rounded-md transition-colors ${isWidgetVisible(widget.id)
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {isWidgetVisible(widget.id) ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div></div>

                {/* Stats Grid */}
                <div className="w-full">
                    <Swiper
                        modules={[Navigation]}

                        spaceBetween={15}
                        slidesPerView={1}
                        navigation
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                    >
                        {stats.map((stat, index) => (
                            <SwiperSlide
                                key={index} className="pb-10 ">
                                <div className="bg-white rounded-xl  border border-gray-200 shadow-sm h-full overflow-hidden transition-all hover:shadow-md">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                                                {stat.trend && (
                                                    <div className={`flex items-center mt-2 text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                        <TrendingUp className={`h-4 w-4 mr-1 ${!stat.trend.isPositive ? 'rotate-180' : ''}`} />
                                                        {stat.trend.value}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`p-3 rounded-full ${stat.color} text-white`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Provider Success Rate & Application Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Provider Success Rate */}
                    {isWidgetVisible('providerSuccessRate') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                    Provider Success Rate
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Authentication success rates by provider</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-64">
                                <Doughnut
                                    data={providerSuccessRateData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        return `${context.label}: ${context.parsed}%`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="mt-4 space-y-2">
                                {providerSuccessRateData.labels?.map((label, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{label as string}</span>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>}

                    {/* app data bar */}
                    {isWidgetVisible('appUsage') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <AppWindow className="h-5 w-5 mr-2 text-indigo-500" />
                                    Application Usage
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Key metrics for top applications</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-84">
                                <Bar
                                    data={appData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }} />
                            </div>
                        </div>
                    </div>}
                    {/* most used authentication  */}
                    {isWidgetVisible('authMode') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
                                    Most Used Authentication Mode</h3>
                                <p className="text-sm text-gray-600 mt-1">Authentication details </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-64">
                                <Doughnut
                                    data={authData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom'
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        return `${context.label}: ${context.parsed}%`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>}
                    {/* Service Provider Expiry */}
                    {isWidgetVisible('providerExpiry') && <div className="bg-white rounded-xl overflow-auto border  border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                                    Service Provider Expiry
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Upcoming provider certificate expirations</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4 h-64 pr-2">
                                {providerExpiryData.map((provider) => (
                                    <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-3 h-3 rounded-full ${getProviderColor(provider.provider)}`}></div>
                                            <div>
                                                <p className="font-medium text-gray-900">{provider.provider}</p>
                                                <p className="text-sm text-gray-500">Expires: {provider.expiryDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                                                {provider.status}
                                            </span>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {provider.daysLeft > 0 ? `${provider.daysLeft} days left` : 'Expired'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>}
                    {/* user role Expiry */}
                    {isWidgetVisible('userRoleExpiry') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <UserX className="h-5 w-5 mr-2 text-red-500" />
                                    User Role Expiry
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">User roles nearing expiration</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {userRoleExpiryData.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.user}</p>
                                            <p className="text-sm text-gray-500">Role: {user.role}</p>
                                            <p className="text-sm text-gray-500">Expires: {user.expiryDate}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>}

                    {/* Portal Usage by Role */}
                    {isWidgetVisible('portalUsage') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                                    Portal Usage by Role
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Usage patterns across different user roles</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-84">
                                <Line
                                    data={portalUsageByRoleData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            r: {
                                                beginAtZero: true,
                                                max: 100
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>}

                    {/* Error and Success Rate */}
                    {isWidgetVisible('errorSuccessRate') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between  p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <LineChart className="h-5 w-5 mr-2 text-green-500" />
                                    Error & Success Rate (24h)
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Authentication success and failure trends</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-64">
                                <Line
                                    data={errorSuccessRateData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                type: 'linear',
                                                position: 'left',
                                                beginAtZero: false,
                                                min: 95,
                                                max: 100,
                                                title: { display: true, text: 'Success Rate (%)' }
                                            },
                                            y1: {
                                                type: 'linear',
                                                position: 'right',
                                                beginAtZero: true,
                                                max: 25,
                                                title: { display: true, text: 'Error Rate (%)' },
                                                grid: {
                                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                                },
                                            },
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>}

                    {/* Tenants */}
                    {isWidgetVisible('tenants') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <Building className="h-5 w-5 mr-2 text-green-500" />
                                    Tenants
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Tenant Management</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-84">
                                <Bar
                                    data={topTenants}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />

                                {/* {tenants.map((tenant) => (
                                    <div key={tenant.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-3 h-3 rounded-full ${getProviderColor(tenant.provider)}`}></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{tenant.name}</p>
                                                    <p className="text-sm text-gray-500">Provider: {tenant.provider}</p>
                                                    <p className="text-sm text-gray-500">Location: {tenant.location}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                                                    {tenant.status}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {tenant.successRate}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    </div>
                    }

                    {/* application alerts */}
                    {isWidgetVisible('appAlerts') && <div className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <div className=" flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                                    Application Alerts
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Active alerts and warnings by application</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-84">
                                <Bar
                                    data={applicationAlertsData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    }
                    {/* least used application table */}
                    {isWidgetVisible('LeastUsed') &&
                        <div className="bg-white rounded-xl border-gray-200 shadow-sm transition-all ">
                            <div className=" flex justify-between p-6 border-b border-gray-200">
                                <div>
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                        <UserX className="h-5 w-5 mr-2 text-red-500" />
                                        Least Used
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Least Application Used</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {leastUsedApplications.map((application) => (
                                        <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{application.name}</p>
                                                <p className="text-sm text-gray-500">Category: {application.category}</p>
                                                <p className="text-sm text-gray-500">Users: {application.users}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeastUsedColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </div>

                                    ))}

                                </div>
                            </div>


                        </div>}
                </div>

                {/* World map for tenants based on country and regions */}
                {isWidgetVisible('tenantDistribution') && (
                    <div className="bg-white rounded-xl border border-gray-200 max-h-[80vh] shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <Building className="h-5 w-5 mr-2 text-blue-500" />
                                    Global Tenant Distribution
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Geographic location of active tenants</p>
                            </div>
                        </div>
                        <div className=" h-[350px] sm:h-[450px] lg:h-[500px]" style={{ position: 'relative', width: '100%' }}>
                            {tooltipContent && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: tooltipPosition.x,
                                        top: tooltipPosition.y,
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        pointerEvents: 'none',
                                        transform: 'translate(-50%, -120%)',
                                        whiteSpace: 'nowrap',
                                        zIndex: 1000,
                                    }}
                                >
                                    {tooltipContent}
                                </div>
                            )}
                            <ComposableMap
                                projectionConfig={{ rotate: [-10, 0, 0], scale: 147, center: [0, 20] }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <ZoomableGroup center={[0, 20]}>
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) => geographies.map((geo: any) => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill="#EAEAEC"
                                                stroke="#FFFFFF"
                                                strokeWidth={0.5}
                                                style={{
                                                    hover: { fill: '#DDD', outline: 'none' },
                                                    pressed: { fill: '#BBB', outline: 'none' },
                                                }}
                                            />
                                        ))}
                                    </Geographies>
                                    {tenantDistributionData.map(({ name, coordinates, users, color }) => (
                                        <Marker key={name} coordinates={coordinates as [number, number]}>
                                            <circle
                                                r={Math.sqrt(users) / 4}
                                                fill={color}
                                                stroke="#fff"
                                                strokeWidth={1}
                                                onMouseMove={(evt) => {
                                                    setTooltipPosition({ x: evt.clientX, y: evt.clientY });
                                                    setTooltipContent(`${name}: ${users} users`);
                                                }}
                                                onMouseLeave={() => {
                                                    setTooltipContent('');
                                                }}
                                            />
                                        </Marker>
                                    ))}
                                </ZoomableGroup>
                            </ComposableMap>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
