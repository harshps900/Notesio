//@ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { CardRenderer } from './Components/CardRender';
import {
    Users, Shield, TrendingUp, Server, AlertTriangle,
    Activity, Database, Clock, Zap, Target, MinusCircle, CheckCircle,
    X, UserX, Settings, Map, BarChart2, CornerUpRight, Key, ListChecks,
    Bell,
    InfoIcon,
    MapPin,
    EyeOff,
    Eye,
    Search,
    User,
    TrendingUpDown,
    ServerCrash,
    Check,
    RotateCcw,
    Plus,
    RefreshCw,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, zoomIn, zoomOut, } from 'react-simple-maps';
import Drawer from '../Drawer1';
import { Tooltip as ReactTooltip } from "react-tooltip";
import SideBar from '../../Components/SideBar';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { Button, TriageAlertBanner } from './Components/ui';
import { SystemOverview } from './Components/SystemOverview.tsx';
import { SecurityHealth } from './Components/SecurityHealth.tsx';
import { ExpirationManagement } from './Components/ExpirationManagement.tsx';
import { AppAnalytics } from './Components/AppAnalytics.tsx';
import { TopTenants } from './Components/TopTenants.tsx';
import { UserLogs } from './Components/UserLogs.tsx';
import toast, { Toaster } from 'react-hot-toast';
import swal from 'sweetalert';
import Setting from './Setting.json';


interface Widget {
    id: string;
    title: string;
    description: string;
    icon: ReactElement;
}

const userLocationMarkers = [
    { name: "New York", coordinates: [-74.006, 40.7128], users: 7800, color: "#3b82f6" },
    { name: "Los Angeles", coordinates: [-118.2437, 34.0522], users: 5100, color: "#10b981" },
    { name: "Chicago", coordinates: [-87.6298, 41.8781], users: 2580, color: "#f59e0b" },
    { name: "Houston", coordinates: [-95.3698, 29.7604], users: 1800, color: "#ef4444" },
    { name: "Phoenix", coordinates: [-112.0740, 33.4484], users: 1200, color: "#a855f7" },
];



const initialMockData = {
    totalTenants: 158, totalApplications: 42, totalUsers: 15480, activeSessions: 7890,
    totalActiveApp: 35, totalInactiveApp: 7, suspiciousActivityCount: 4,
    criticalAlertMessage: 'West Valley District is experiencing a 15% latency increase in authentication.',
    hasCriticalAlert: true,

    providerSuccess: [
        { name: 'Google (OAuth)', successRate: 98, logins: 15200, color: '#3b82f6' },
        { name: 'Google (SAML)', successRate: 65, logins: 1200, color: '#ef4444' },
        { name: 'Microsoft (OAuth)', successRate: 42, logins: 800, color: '#f59e0b' },
        { name: 'Microsoft (SAML)', successRate: 92, logins: 7800, color: '#10b981' },
        { name: 'ADFS (OAuth)', successRate: 85, logins: 3400, color: '#a855f7' },
        { name: 'ADFS (SAML)', successRate: 85, logins: 3400, color: '#6366f1' },
        { name: 'AD-Login', successRate: 72, logins: 1200, color: '#eab308' },
    ],

    authTimeSeries: [
        { name: '08:00', success: 400, failure: 20 }, { name: '09:00', success: 300, failure: 10 },
        { name: '10:00', success: 600, failure: 30 }, { name: '11:00', success: 800, failure: 40 },
        { name: '12:00', success: 450, failure: 25 }, { name: '13:00', success: 550, failure: 30 },
    ],

    appUsage: [
        { name: 'LMS Core', users: 14500, mode: 'OAuth', totalCapacity: 15000, color: '#10b981' },
        { name: 'HR Portal', users: 5200, mode: 'SAML', totalCapacity: 10000, color: '#3b82f6' },
        { name: 'Finance System', users: 2100, mode: 'SAML', totalCapacity: 5000, color: '#f59e0b' },
        { name: 'IT Helpdesk', users: 4500, mode: 'OAuth', totalCapacity: 8000, color: '#ef4444' },
        { name: 'ArchivedDocs', users: 15, mode: 'AD-Login', totalCapacity: 500, color: '#a855f7' },
    ],
    unUsedAppUsage: [
        { name: 'LMS Core', users: 15, mode: 'OAuth', totalCapacity: 15000, color: '#10b981' },
        { name: 'HR Portal', users: 4500, mode: 'SAML', totalCapacity: 10000, color: '#3b82f6' },
        { name: 'Finance System', users: 2100, mode: 'SAML', totalCapacity: 5000, color: '#f59e0b' },
        { name: 'IT Helpdesk', users: 5200, mode: 'OAuth', totalCapacity: 8000, color: '#ef4444' },
        { name: 'ArchivedDocs', users: 14500, mode: 'AD-Login', totalCapacity: 500, color: '#a855f7' },
    ],

    topTenantsByUser: [
        { name: 'East Coast Schools', users: 7800, color: '#3b82f6' }, { name: 'West Valley District', users: 5100, color: '#10b981' },
        { name: 'Midwest Charter Org', users: 2580, color: '#f59e0b' }, { name: 'SouthWest Academies', users: 1800, color: '#ef4444' },
        { name: 'Global Tech Ed', users: 1200, color: '#a855f7' },
    ],

    tenantsByLocation: {
        'New York': [{ name: 'LMS Core', users: 4500 }, { name: 'Finance System', users: 2100 }, { name: 'HR Portal', users: 1200 }, { name: 'IT Helpdesk', users: 800 }, { name: 'ArchivedDocs', users: 300 }],
        'Los Angeles': [{ name: 'LMS Core', users: 3200 }, { name: 'Finance System', users: 1800 }, { name: 'HR Portal', users: 1500 }, { name: 'IT Helpdesk', users: 900 }, { name: 'ArchivedDocs', users: 450 }],
        'Chicago': [{ name: 'LMS Core', users: 1800 }, { name: 'Finance System', users: 1200 }, { name: 'HR Portal', users: 950 }, { name: 'IT Helpdesk', users: 600 }, { name: 'ArchivedDocs', users: 200 }],
        'Houston': [{ name: 'LMS Core', users: 1300 }, { name: 'Finance System', users: 900 }, { name: 'HR Portal', users: 750 }, { name: 'IT Helpdesk', users: 500 }, { name: 'ArchivedDocs', users: 150 }],
        'Phoenix': [{ name: 'LMS Core', users: 900 }, { name: 'Finance System', users: 700 }, { name: 'HR Portal', users: 650 }, { name: 'IT Helpdesk', users: 400 }, { name: 'ArchivedDocs', users: 100 }],
    },

    serviceProviderExpires: [
        { name: 'LMS Core Cert', expiryDays: 6, status: 'Urgent' },
        { name: 'Finance System Cert', expiryDays: 15, status: 'Warning' },
        { name: 'HR Portal Cert', expiryDays: 120, status: 'OK' },
    ],

    userRoleExpires: [
        { user: 'JSmith', role: 'Temp Admin', expiryDays: 5, status: 'Expired Soon' },
        { user: 'MBrown', role: 'Contractor', expiryDays: 25, status: 'Warning' },
        { user: 'AKhan', role: 'Guest', expiryDays: 90, status: 'OK' },
    ],

    portalUsageByRole: [
        { role: 'Student', sessions: 12500 }, { role: 'Teacher', sessions: 5200 },
        { role: 'Admin', sessions: 850 }, { role: 'Guest', sessions: 400 },
    ],

    browserUsage: [
        { name: 'Chrome', users: 12500, color: '#3b82f6' },
        { name: 'Edge', users: 5200, color: '#10b981' },
        { name: 'Safari', users: 3800, color: '#f59e0b' },
        { name: 'Firefox', users: 1500, color: '#ef4444' },
        { name: 'Other', users: 480, color: '#a855f7' },
    ],

    mostUsedApps: [
        { name: 'LMS Core', users: 14500, time: '09:00', am_pm: 'AM', color: '#10b981' },
        { name: 'HR Portal', users: 5200, time: '11:30', am_pm: 'AM', color: '#3b82f6' },
        { name: 'Finance System', users: 2100, time: '02:15', am_pm: 'PM', color: '#f59e0b' },
        { name: 'IT Helpdesk', users: 4500, time: '10:00', am_pm: 'AM', color: '#ef4444' },
        { name: 'ArchivedDocs', users: 15, time: '04:00', am_pm: 'PM', color: '#a855f7' },
    ],

    logData: [
        { user: 'Alice J.', location: 'NYC, USA', osBrowser: 'Win 11 / Chrome', lastLogin: '16/10/2025 09:15:32', response: 'Success', status: 'success' },
        { user: 'Bob K.', location: 'Los Angeles, USA', osBrowser: 'iOS / Safari', lastLogin: '4/10/2025 14:05:11', response: 'Success', status: 'success' },
        { user: 'Carlos M.', location: 'Chicago, USA', osBrowser: 'Mac OS / Edge', lastLogin: '4/09/2025 11:22:05', response: 'Fail (AD)', status: 'fail' },
        { user: 'David L.', location: 'NYC, USA', osBrowser: 'Win 11 / Chrome', lastLogin: '22/10/2025 16:45:50', response: 'Success', status: 'success' },
        { user: 'Eva G.', location: 'Houston, USA', osBrowser: 'Android / Chrome', lastLogin: '4/08/2025 08:30:00', response: 'Success', status: 'success' },
        { user: 'Frank H.', location: 'Phoenix, USA', osBrowser: 'Win 11 / Firefox', lastLogin: '4/08/2025 17:10:21', response: 'Fail (MFA)', status: 'fail' },
        { user: 'Grace I.', location: 'Los Angeles, USA', osBrowser: 'iOS / Safari', lastLogin: '4/07/2025 10:01:47', response: 'Success', status: 'success' },
    ]
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#6366f1'];


const loadLayoutFromSettings = (settings) => {
    if (settings && settings.layout) {
        return {
            sectionOrder: settings.layout.sectionOrder,
            cardOrders: settings.layout.cardOrders,
        };
    }
    
    return {
        sectionOrder: ['systemOverView', 'SecurityHealth', 'expirationManagement', 'appAnalytics', 'topTenants', 'userLogs'],
        cardOrders: {
            systemOverView: ['totalTenants', 'totalApplications', 'totalUsers', 'activeSessions', 'activeApps', 'inactiveApps', 'suspiciousActivity'],
            SecurityHealth: ['providerSuccess', 'authTimeSeries'],
            expirationManagement: ['serviceProviderExpires', 'userRoleExpires', 'portalUsageByRole'],
            appAnalytics: ['mostUsedApps', 'deviceList', 'unUsedApps'],
            topTenants: ['topTenantsByUser', 'mostUsedAppByTenants', 'userLocation'],
            userLogs: ['logActivity']
        }
    };
};


const loadHiddenWidgetsFromSettings = (settings) => {
    const hidden = new Set<string>();
    if (!settings || !settings.widgets) {
        return hidden;
    }
    for (const widgetId in settings.widgets) {
        if (settings.widgets[widgetId]?.is_visible === 'hide') {
            hidden.add(widgetId);
        }
    }
    return hidden;
};



const loadCardSizesFromSettings = (settings) => {
    const sizes = {};
    if (!settings || !settings.widgets) {
        console.error("Settings file is invalid or widgets are missing.");
        return sizes;
    }

    for (const widgetId in settings.widgets) {
        const widget = settings.widgets[widgetId];
        if (widget && widget.CSS) {
            const size = widget.CSS.resized_Card || widget.CSS.default_Size;
            if (size) {
                sizes[widgetId] = {
                    width: size.width || '100%',
                    height: size.height || 150, 
                };
            }
        }
    }
    return sizes;
};


const SinglePageDashboard = () => {
    const [showAlert, setShowAlert] = useState(initialMockData.hasCriticalAlert);
    const [modalContent, setModalContent] = useState(null);
    const [mapZoom, setMapZoom] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState('New York');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeId, setActiveId] = useState(null);
    const [activeView, setActiveView] = useState('home');
    const [isCustomizeOpen, setIsCustomizOpen] = useState(false);
    const [isDragAndDropActive, setIsDragAndDropActive] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [recentlyRemoved, setRecentlyRemoved] = useState<string[]>([]);
    const [isResizing, setIsResizing] = useState(false);
    const [flexedSections, setFlexedSections] = useState<Set<string>>(new Set());
    const [backupState, setBackupState] = useState(null);
    const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleTimeString());
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [mockData, setMockData] = useState(initialMockData);
    const [drawerWidth, setDrawerWidth] = useState('30rem');

    const [hiddenWidgets, setHiddenWidgets] = useState(() => loadHiddenWidgetsFromSettings(Setting));
    
    const [sectionOrder, setSectionOrder] = useState(() => loadLayoutFromSettings(Setting).sectionOrder);
    
    const [cardOrders, setCardOrders] = useState(() => loadLayoutFromSettings(Setting).cardOrders);
    
    const [cardSizes, setCardSizes] = useState(() => loadCardSizesFromSettings(Setting));


    const updateSystemOverviewData = () => {
        setMockData(prevData => ({
            ...prevData,
            totalTenants: prevData.totalTenants + Math.floor(Math.random() * 5) + 1,
            totalApplications: prevData.totalApplications + Math.floor(Math.random() * 2) + 1,
            totalUsers: prevData.totalUsers + Math.floor(Math.random() * 50) + 10,
            activeSessions: prevData.activeSessions + Math.floor(Math.random() * 100) - 50,
        }));
    };

    const refreshDashboard = useCallback(() => {
        setIsRefreshing(true);
        updateSystemOverviewData();
        setTimeout(() => {
            setLastRefresh(new Date().toLocaleTimeString());
            setIsRefreshing(false);
        }, 1500);
    }, []);

    useEffect(() => {
        const updateDrawerWidth = () => {
            if (window.innerWidth < 768) {
                setDrawerWidth('100%');
            } else {
                setDrawerWidth('30rem');
            }
        };
        updateDrawerWidth();
        window.addEventListener('resize', updateDrawerWidth);
        return () => window.removeEventListener('resize', updateDrawerWidth);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updateSystemOverviewData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [activeId]);

    const handleMapZoomIn = () => {
        setMapZoom(prev => Math.min(prev * 1.5, 8));
    };

    const handleMapZoomOut = () => {
        setMapZoom(prev => Math.max(prev / 1.5, 1));
    };

    const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocation(event.target.value);
    };

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 15,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findSection = (id) => {
        if (sectionOrder.includes(id)) {
            return id;
        }
        return Object.keys(cardOrders).find(section => cardOrders[section].includes(id));
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        setHasUnsavedChanges(true);

        if (sectionOrder.includes(active.id) && sectionOrder.includes(over.id)) {
            setSectionOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            return;
        }

        const sourceSection = findSection(active.id);
        const destinationSection = findSection(over.id);

        if (!sourceSection || !destinationSection) {
            return;
        }

        if (sourceSection === destinationSection) {
            setCardOrders(prev => ({
                ...prev,
                [sourceSection]: arrayMove(
                    prev[sourceSection],
                    prev[sourceSection].indexOf(active.id),
                    prev[sourceSection].indexOf(over.id)
                )
            }));
        } else {
            setCardOrders(prev => {
                const sourceItems = [...prev[sourceSection]];
                const destinationItems = [...prev[destinationSection]];
                const sourceIndex = sourceItems.indexOf(active.id);
                const [movedItem] = sourceItems.splice(sourceIndex, 1);
                const overIsASection = sectionOrder.includes(over.id);
                const destIndex = overIsASection
                    ? destinationItems.length
                    : destinationItems.indexOf(over.id);
                destinationItems.splice(destIndex, 0, movedItem);
                return {
                    ...prev,
                    [sourceSection]: sourceItems,
                    [destinationSection]: destinationItems,
                };
            });
        }
    }

    const handleResizeStop = (cardId, newSize) => {
        const section = findSection(cardId);
        if (section) {
            setFlexedSections(prev => new Set(prev).add(section));
        }
        setCardSizes(prev => ({
            ...prev,
            [cardId]: newSize,
        }));
        setHasUnsavedChanges(true);
    };

    const availableWidgets: Widget[] = [
        {
            id: 'systemOverView',
            title: 'System Overview',
            description: 'Key performance indicators for the entire system.',
            icon: <Database className="w-5 h-5 text-indigo-500" />
        },
        {
            id: 'totalTenants',
            title: 'Total Tenants',
            description: 'Total organizations registered.',
            icon: <Users className="w-5 h-5 text-indigo-500" />
        },
        {
            id: 'totalApplications',
            title: 'Total Applications',
            description: 'Total apps integrated.',
            icon: <Target className="w-5 h-5 text-blue-500" />
        },
        {
            id: 'totalUsers',
            title: 'Total Users',
            description: 'Cumulative count across all tenants.',
            icon: <Users className="w-5 h-5 text-emerald-500" />
        },
        {
            id: 'activeSessions',
            title: 'Active Sessions',
            description: 'Current logged-in users.',
            icon: <Clock className="w-5 h-5 text-purple-500" />
        },
        {
            id: 'activeApps',
            title: 'Active Apps',
            description: 'Apps with active users/config.',
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
        },
        {
            id: 'inactiveApps',
            title: 'Inactive Apps',
            description: 'Apps without recent activity.',
            icon: <MinusCircle className="w-5 h-5 text-amber-500" />
        },
        {
            id: 'suspiciousActivity',
            title: 'Suspicious Activity',
            description: 'Flagged security events.',
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />
        },
        {
            id: 'SecurityHealth',
            title: 'Security Health',
            description: 'Security details',
            icon: <Shield className="w-5 h-5 text-blue-500" />
        },
        {
            id: 'providerSuccess',
            title: 'Provider Success Rate',
            description: 'Login success rate by authentication type (SAML/OAuth).',
            icon: <Shield className="w-5 h-5 text-green-500" />
        },
        {
            id: 'authTimeSeries',
            title: 'Error and Success Rate (Time Series)',
            description: 'Login success/failure details over time.',
            icon: <Clock className="w-5 h-5 text-gray-500" />
        },
        {
            id: 'expirationManagement',
            title: 'Expiration & Management',
            description: 'Track certificate and user role expirations.',
            icon: <Zap className="w-5 h-5 text-red-500" />
        },
        {
            id: 'serviceProviderExpires',
            title: 'Service Provider Exprire',
            description: 'Track the Service Provider Expire details',
            icon: <ServerCrash className="w-5 h-5 text-red-500" />
        },
        {
            id: 'userRoleExpires',
            title: 'User Role Expires',
            description: 'Track the User Role Expire details',
            icon: <UserX className="w-5 h-5 text-red-500" />
        },
        {
            id: 'portalUsageByRole',
            title: 'Portal Usage By Role',
            description: 'Portal Usage By Role',
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
        },
        {
            id: 'appAnalytics',
            title: 'Application Usage & Popularity',
            description: 'Analysis of application usage and device distribution.',
            icon: <Check className="w-5 h-5 text-blue-500" />
        },
        {
            id: 'mostUsedApps',
            title: 'Most Used Applications',
            description: 'Top 5 most used applications.',
            icon: <BarChart2 className="w-5 h-5 text-indigo-500" />
        },
        {
            id: 'deviceList',
            title: 'Application Devices',
            description: 'Device list',
            icon: <Key className="w-5 h-5 text-purple-500" />
        },
        {
            id: 'unUsedApps',
            title: 'Un-Used Applications & Analysis',
            description: 'Un-Used Applications & Analysis',
            icon: <AlertTriangle className="w-5 h-5 text-amber-800" />
        },
        {
            id: 'topTenants',
            title: 'Top Tenants',
            description: 'Users Across Country',
            icon: <MapPin className="w-5 h-5 text-teal-500" />
        },
        {
            id: 'topTenantsByUser',
            title: 'Tenant Location & Ranking',
            description: 'Geographic distribution and performance of tenants.',
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
        },
        {
            id: 'mostUsedAppByTenants',
            title: 'Tenant using the application most',
            description: 'Tenants Using the Application Most in durations',
            icon: <TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
        },
        {
            id: 'userLocation',
            title: 'User By Location',
            description: 'Geographic distribution and performance of tenants.',
            icon: <MapPin className="w-5 h-5 text-teal-500" />
        },
        {
            id: 'userLogs',
            title: 'User logs Details',
            description: 'User Login Activity',
            icon: <Activity className="w-5 h-5 text-gray-500" />
        },
        {
            id: 'logActivity',
            title: 'User Activity Log',
            description: 'A detailed log of user authentications.',
            icon: <Activity className='w-5 h-5 text-emerald-500' />
        }
    ];

    const filteredWidgets = availableWidgets.filter(widget =>
        widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCustomizeClick = () => {
        // Backup the *current* state
        setBackupState({
            sectionOrder: [...sectionOrder],
            cardOrders: { ...cardOrders },
            hiddenWidgets: new Set(hiddenWidgets),
            cardSizes: { ...cardSizes },
            flexedSections: new Set(flexedSections),
        });
        setIsDragAndDropActive(true);
    };

    const handleSave = () => {
        setIsDragAndDropActive(false);
        setIsCustomizOpen(false);
        if (hasUnsavedChanges) {
            // This is where you would send the current state
            // (sectionOrder, cardOrders, hiddenWidgets, cardSizes)
            // to a backend to update Setting.json
            toast.success('Changes have been saved (in session)!');
        }
        setHasUnsavedChanges(false);
        setBackupState(null);
    };

    const handleCancel = () => {
        swal({
            title: 'Are you sure you want to discard the changes?',
            icon: 'warning',
            dangerMode: true,
            buttons: ["No", "Yes"],
        }).then(async (willCancel) => {
            if (willCancel) {
                if (backupState) {
                    // Restore from the backup
                    setSectionOrder(backupState.sectionOrder);
                    setCardOrders(backupState.cardOrders);
                    setHiddenWidgets(backupState.hiddenWidgets);
                    setCardSizes(backupState.cardSizes);
                    setFlexedSections(backupState.flexedSections);
                }
                setIsDragAndDropActive(false);
                setIsCustomizOpen(false);
                setHasUnsavedChanges(false);
                setBackupState(null);
            }
        });
    };

    const handleCloseDrawer = () => {
        setIsCustomizOpen(false);
    };

    const handleResetLayout = () => {
        swal({
            title: 'Are you sure you want to reset the layout?',
            icon: 'warning',
            dangerMode: true,
            buttons: ["No", "Yes"],
        }).then(async (willReset) => {
            if (willReset) {
                // UPDATED: Reset all state from the Setting.json file
                const defaultLayout = loadLayoutFromSettings(Setting);
                setSectionOrder(defaultLayout.sectionOrder);
                setCardOrders(defaultLayout.cardOrders);
                setHiddenWidgets(loadHiddenWidgetsFromSettings(Setting));
                setCardSizes(loadCardSizesFromSettings(Setting));
                
                setRecentlyRemoved([]);
                setHasUnsavedChanges(true);
                setFlexedSections(new Set());

                // REMOVED: No more localStorage to clear
                toast.success('Layout has been reset to default!');
            }
        });
    };

    const toggleWidgetVisibility = (widgetId: string) => {
        const section = findSection(widgetId);
        if (section) {
            setFlexedSections(prev => {
                const newFlexed = new Set(prev);
                newFlexed.delete(section);
                return newFlexed;
            });
        }
        setHasUnsavedChanges(true);
        setHiddenWidgets(prevHiddenWidgets => {
            const newHiddenWidgets = new Set(prevHiddenWidgets);
            if (newHiddenWidgets.has(widgetId)) {
                newHiddenWidgets.delete(widgetId);
                setRecentlyRemoved(prev => prev.filter(id => id !== widgetId));
            } else {
                newHiddenWidgets.add(widgetId);
                setRecentlyRemoved(prev => [widgetId, ...prev.filter(id => id !== widgetId)]);
            }
            return newHiddenWidgets;
        });
    };


    const isWidgetVisible = (widgetId: string) => {
        return !hiddenWidgets.has(widgetId);
    }

    const renderDashboardContent = () => (
        <div className="space-y-8">
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                {sectionOrder.map((sectionId, index) => (
                    <div key={sectionId} >
                        {renderSection(sectionId, index)}
                    </div>
                ))}
            </SortableContext>
        </div>
    );

    const renderWidgetList = (widgetIds) => {
        return widgetIds
            .map(id => availableWidgets.find(w => w.id === id))
            .filter(Boolean)
            .map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                        {widget.icon}
                        <div>
                            <h4 className="font-semibold">{widget.title}</h4>
                            <p className="text-sm text-gray-500">{widget.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWidgetVisibility(widget.id);
                        }}
                        className={`flex items-center px-3 py-1.5 text-xs rounded-md transition-colors ${isWidgetVisible(widget.id)
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                    >
                        {isWidgetVisible(widget.id) ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {isWidgetVisible(widget.id) ? 'Hide' : 'Show'}
                    </button>
                </div>
            ));
    };

    const renderSection = useCallback((sectionId) => {
        const sectionProps = {
            mockData,
            cardOrders,
            sectionId,
            isDragAndDropActive,
            isWidgetVisible,
            userLocationMarkers,
            mapZoom,
            handleMapZoomIn,
            handleMapZoomOut,
            selectedLocation,
            handleLocationChange,
            toggleWidgetVisibility,
            cardSizes,
            onResizeStop: (id, size) => {
                setIsResizing(false);
                handleResizeStop(id, size);
            },
            onResizeStart: () => setIsResizing(true),
            isResizing,
            isFlex: flexedSections.has(sectionId)
        };

        switch (sectionId) {
            case 'systemOverView':
                return isWidgetVisible('systemOverView') && <SystemOverview {...sectionProps} />;

            case 'SecurityHealth':
                return isWidgetVisible('SecurityHealth') && <SecurityHealth {...sectionProps} />;

            case 'expirationManagement':
                return isWidgetVisible('expirationManagement') && <ExpirationManagement {...sectionProps} />;

            case 'appAnalytics':
                return isWidgetVisible('appAnalytics') && <AppAnalytics {...sectionProps} />;

            case 'topTenants':
                return isWidgetVisible('topTenants') && <TopTenants {...sectionProps} />;

            case 'userLogs':
                return isWidgetVisible('userLogs') && <UserLogs {...sectionProps} />;

            default:
                return null;
        }
    }, [isDragAndDropActive, isResizing, cardOrders, cardSizes, flexedSections, sectionOrder, hiddenWidgets, selectedLocation, mockData]);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* <aside className='hidden md:block lg:block xl:block sm:hidden'>
                <SideBar
                    toggleHome={() => handleToggle('home')}
                    isHomeCLick={activeView === 'home'}
                    toggleFavourites={() => handleToggle('favourites')}
                    isFavouritesClick={activeView ===m 'favourites'}
                    toggleTrash={() => handleToggle('trash')}
                    isTrashClick={activeView === 'trash'}
                />
            </aside> */}

            <main className="flex-1 overflow-y-auto p-6">
                <Toaster
                    position="top-center"
                    reverseOrder={false} />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h1 className='text-3xl font-bold text-gray-900 whitespace-nowrap'>SSO Admin Dashboard</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button
                            onClick={refreshDashboard}
                            disabled={isRefreshing}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span>{isRefreshing ? 'Refreshing...' : `Refresh`}</span>
                        </Button>
                        {!isDragAndDropActive ? (
                            <Button
                                onClick={handleCustomizeClick}
                                className="flex items-center justify-center text-sm shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                <Settings className="w-4 h-4 mr-2" /> Customize
                            </Button>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Button
                                    onClick={handleResetLayout}
                                    className="flex items-center justify-center text-sm shadow-md bg-white text-red-600 border border-red-300 hover:bg-red-50"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    className="flex items-center justify-center text-sm shadow-md bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="flex items-center justify-center text-sm shadow-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <Drawer
                    isOpen={isCustomizeOpen}
                    onClose={handleCloseDrawer}
                    title="Customize Dashboard"
                    width={drawerWidth}
                >
                    <div className="space-y-4">
                        <div className='relative flex items-center justify-between mb-4'>
                            <input
                                type='text'
                                placeholder='Search widgets...'
                                className='w-full rounded-xl bg-gray-100 shadow-inner p-2 pl-10'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className='absolute left-3 w-5 h-5 text-gray-400' />
                        </div>
                        {recentlyRemoved.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Recently Removed</h3>
                                {renderWidgetList(recentlyRemoved)}
                                <hr className="my-6" />
                            </div>
                        )}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">All Widgets</h3>
                            {filteredWidgets.length > 0 ? (
                                renderWidgetList(filteredWidgets.map(w => w.id).filter(id => !recentlyRemoved.includes(id)))
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No widgets found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Drawer>
                <TriageAlertBanner
                    message={mockData.criticalAlertMessage}
                    isVisible={showAlert}
                    AlertTriangle={AlertTriangle}
                    onInvestigate={() => {
                        setShowAlert(false);
                        setModalContent({ title: 'Alert Triage', message: mockData.criticalAlertMessage, details: 'Opening Triage workflow...' });
                    }}
                />
                <div className="relative">
                    {isDragAndDropActive ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}>
                            <div className="space-y-8">
                                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                                    {sectionOrder.map((sectionId) => (
                                        <div key={sectionId} >
                                            {renderSection(sectionId)}
                                        </div>
                                    ))}
                                </SortableContext>
                            </div>
                            <DragOverlay>
                                {activeId ? (
                                    <div className="opacity-50">
                                        {sectionOrder.includes(activeId) ? (
                                            <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-indigo-300">
                                                Dragging Section
                                            </div>
                                        ) : (
                                            <div className="bg-white p-2 rounded shadow border-2 border-blue-300">
                                                Dragging Card
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        renderDashboardContent()
                    )}
                    {isDragAndDropActive && (
                        <button
                            onClick={() => setIsCustomizOpen(true)}
                            className="fixed bottom-8 right-8 z-10 flex h-14 w-14 items-center cursor-pointer justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform  hover:bg-indigo-700"
                        >
                            <Plus className="h-6 w-6" />
                        </button>
                    )}
                </div>
                <ReactTooltip place='bottom' style={{ backgroundColor: 'black', color: 'white' }} id="info-tooltip" />
            </main>
        </div>
    );
};

export default SinglePageDashboard;