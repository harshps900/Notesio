//@ts-nocheck
import React, { useMemo } from 'react';
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';
import { AlertTriangle, BarChart2, Key, ListChecks, Server, UserX, Shield, Clock, Map, Activity, TrendingUp, Users, ArrowUpDown, Search, Filter, CalendarDays } from 'lucide-react'; // <-- Ensure Filter is imported
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard, SimpleCustomSelect } from './ui';
import { GeoMap } from './GeoMap';
import ColumnFilterDropdown from './ColumnFilter';
import DateRangePicker, { DateRange } from './DateRangePicker'
import { parse } from 'date-fns';

interface CardRendererProps {
    cardId: string;
    mockData: any;
    userLocationMarkers?: any[];
    mapZoom?: number;
    handleMapZoomIn?: () => void;
    handleMapZoomOut?: () => void;
    selectedLocation?: string;
    handleLocationChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}


const getStatusColor = (days: number) => {
    if (days <= 7) return 'bg-red-500';
    if (days <= 30) return 'bg-amber-500';
    return 'bg-emerald-500';
};

const formatDateRangeDisplay = (range: DateRange): string => {
    if (range.filterType === 4) return "Today";
    if (range.filterType === 5) return "This Month";
    if (range.filterType === 6) return "Last 7 Days";

    if (range.filterType === 0 || (!range.startDate && (range.filterType === 3)) || (!range.endDate && (range.filterType === 2)) || (!range.startDate && !range.endDate && range.filterType === 1)) {
        return "Filter Date...";
    }

    const formatIfDate = (date: Date | null | undefined) => date ? new Date(date).toLocaleDateString() : '...';

    switch (range.filterType) {
        case 1:
            return `${formatIfDate(range.startDate)} - ${formatIfDate(range.endDate)}`;
        case 2:
            return `Before ${formatIfDate(range.endDate)}`;
        case 3:
            return `After ${formatIfDate(range.startDate)}`;
        default:
            return "Filter Date...";
    }
};

export const CardRenderer: React.FC<CardRendererProps> = ({
    cardId,
    mockData,
    userLocationMarkers,
    mapZoom, handleMapZoomIn, handleMapZoomOut,
    selectedLocation, handleLocationChange
}) => {

    switch (cardId) {

        case 'totalTenants':
        case 'totalApplications':
        case 'totalUsers':
        case 'activeSessions':
        case 'activeApps':
        case 'inactiveApps':
        case 'suspiciousActivity':
            const cardDataMap: { [key: string]: any } = {
                'totalTenants': { icon: Users, title: "Total Tenants", getValue: (data: any) => data.totalTenants, color: "indigo", description: "Total organizations registered." },
                'totalApplications': { icon: BarChart2, title: "Total Applications", getValue: (data: any) => data.totalApplications, color: "blue", description: "Total apps integrated." },
                'totalUsers': { icon: Users, title: "Total Users", getValue: (data: any) => data.totalUsers, color: "green", description: "Cumulative count across all tenants." },
                'activeSessions': { icon: Clock, title: "Active Sessions", getValue: (data: any) => data.activeSessions, color: "purple", description: "Current logged-in users." },
                'activeApps': { icon: Key, title: "Active Apps", getValue: (data: any) => data.totalActiveApp, color: "green", description: "Apps with active users/config." },
                'inactiveApps': { icon: Key, title: "Inactive Apps", getValue: (data: any) => data.totalInactiveApp, color: "yellow", description: "Apps without recent activity." },
                'suspiciousActivity': {
                    icon: AlertTriangle, title: "Suspicious Activity", unit: "events", getValue: (data: any) => data.suspiciousActivityCount,
                    getColor: (data: any) => data.suspiciousActivityCount > 0 ? 'red' : 'gray', color: 'gray', description: "Flagged security events."
                }
            };

            const cardDefinition = cardDataMap[cardId];
            if (!cardDefinition) return null;
            const cardProps = {
                icon: cardDefinition.icon,
                title: cardDefinition.title,
                value: cardDefinition.getValue(mockData),
                unit: cardDefinition.unit || "",
                color: cardDefinition.getColor ? cardDefinition.getColor(mockData) : cardDefinition.color,
                description: cardDefinition.description,
            };
            return <StatCard {...cardProps} />;

        case 'providerSuccess':
            const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#6366f1'];
            return (
                <div className="h-full">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Shield className="w-5 h-5 mr-2 text-blue-500" />Provider Success Rate</CardTitle>
                            <CardDescription>Login success rate by authentication type</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart> 
                                        <Pie
                                            data={mockData.providerSuccess}
                                            dataKey="successRate"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60} 
                                            outerRadius={100} 
                                            paddingAngle={2}
                                            labelLine={false}
                                            label={false}
                                        >
                                            {mockData.providerSuccess.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip formatter={(value: number, name: string, props: any) => [`${value}% Success (${props.payload.logins.toLocaleString()} logins)`, name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 pt-4 border-t mt-4 flex-shrink-0">
                                {mockData.providerSuccess.map((provider: any, index: number) => (
                                    <div key={provider.name} className="flex items-center text-xs font-medium">
                                        <span style={{ backgroundColor: COLORS[index % COLORS.length] }} className="w-2 h-2 rounded-full mr-2"></span>
                                        <span>{provider.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );

        case 'authTimeSeries':
            const total = mockData.authTimeSeries.reduce((sum: number, item: any) => sum + item.success + item.failure, 0);
            const totalSuccess = mockData.authTimeSeries.reduce((sum: number, item: any) => sum + item.success, 0);
            const successRate = total > 0 ? (totalSuccess / total) * 100 : 0;
            return (
                <div className="h-full w-full">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-500" />Error and Success Rate (Time Series)</CardTitle>
                            <CardDescription>Login success/failure details</CardDescription>
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Overall Success Rate:</span>
                                    <span className="font-extrabold text-lg text-emerald-600">{successRate.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${successRate}%` }}></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1">
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockData.authTimeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="success" stackId="1" stroke="#10b981" fill="#10b98180" name="Success" />
                                        <Area type="monotone" dataKey="failure" stackId="1" stroke="#ef4444" fill="#ef444480" name="Failure" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );

        case 'serviceProviderExpires':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Server className='w-5 h-5 mr-2 text-red-500' /> Service Provider Expirations</CardTitle>
                        <CardDescription>Certificate expiration timeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 space">
                            {mockData.serviceProviderExpires.map((item: any) => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-sm font-semibold mb-2">
                                        <span>{item.name}</span>
                                        <span>{item.expiryDays} days</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`h-2 rounded-full ${getStatusColor(item.expiryDays)}`} style={{ width: `${Math.min((item.expiryDays / 180) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            );

        case 'userRoleExpires':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><UserX className='w-5 h-5 mr-2 text-amber-500' /> User Role Expirations</CardTitle>
                        <CardDescription>Upcoming role expirations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b text-xs uppercase">
                                    <th className="pb-2">User</th>
                                    <th className="pb-2">Role</th>
                                    <th className="pb-2">Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockData.userRoleExpires.map((item: any) => (
                                    <tr key={item.user} className={`border-b ${item.expiryDays <= 7 ? 'bg-red-50 animate-pulse' : item.expiryDays <= 30 ? 'bg-amber-50 animate-pulse' : ''}`}>
                                        <td className="py-3 px-2">{item.user}</td>
                                        <td>{item.role}</td>
                                        <td className={`font-semibold ${item.expiryDays <= 7 ? 'text-red-600' : item.expiryDays <= 30 ? 'text-amber-600' : ''}`}>{item.expiryDays}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            );

        case 'portalUsageByRole':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><ListChecks className='w-5 h-5 mr-2 text-indigo-500' /> Portal Usage by Role</CardTitle>
                        <CardDescription>Session distribution by user role</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockData.portalUsageByRole} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="role" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} Sessions`, 'Sessions']} />
                                    <Bar dataKey="sessions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            );

        case 'mostUsedApps':
            const mostUsed = [...mockData.appUsage].sort((a, b) => b.users - a.users).slice(0, 5);
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><BarChart2 className='w-5 h-5 mr-2 text-indigo-500' /> Most Used Applications</CardTitle>
                        <CardDescription>Top 5 most used applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-10">
                            {mostUsed.map((app: any) => (
                                <div key={app.name}>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>{app.name}</span>
                                        <span>{app.users.toLocaleString()} Users</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="h-2 rounded-full" style={{ width: `${(app.users / app.totalCapacity) * 100}%`, backgroundColor: app.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            );

        case 'deviceList':
            const totalBrowserUsers = mockData.browserUsage.reduce((sum: number, entry: any) => sum + entry.users, 0);
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Key className='w-5 h-5 mr-2 text-purple-500' /> Application Devices</CardTitle>
                        <CardDescription>Browser usage distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart> 
                                    <Pie
                                        data={mockData.browserUsage}
                                        dataKey="users"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}  
                                        outerRadius={120} 
                                        paddingAngle={3}
                                    >
                                        {mockData.browserUsage.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()} Users`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-4 border-t mt-4 flex-shrink-0">
                            {mockData.browserUsage.map((device: any) => (
                                <div key={device.name} className="flex items-center text-sm">
                                    <span style={{ backgroundColor: device.color }} className="w-3 h-3 rounded-full mr-2"></span>
                                    <span>{device.name}</span>
                                    <span className="ml-1 font-medium">({((device.users / totalBrowserUsers) * 100).toFixed(1)}%)</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            );

        case 'unUsedApps':
            const leastUsed = [...mockData.unUsedAppUsage].sort((a, b) => b.users - a.users).slice(0, 5);
            const leastUsedApp = leastUsed[0];
            return (
                <Card className='bg-yellow-50 border-yellow-200'>
                    <CardHeader>
                        <CardTitle className="flex items-center text-amber-800"><AlertTriangle className='w-5 h-5 mr-2' /> Un-Used Applications & Analysis</CardTitle>
                        <CardDescription>Applications with low usage patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='font-semibold mb-3'>Un-Used Applications:</p>
                        <div className="space-y-2">
                            {leastUsed.map((app: any) => (<div key={app.name} className="flex justify-between items-center bg-white p-3 rounded-lg border"><span className="text-sm">{app.name}</span><span className='font-bold text-red-600 text-sm'>{app.users} users</span></div>))}
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <CardTitle className="text-base mb-2">Why not popular?</CardTitle>
                            <p className="text-sm mb-2"><strong>{leastUsedApp.name}</strong> has the lowest usage.</p>
                            <p className="text-xs">Reason: Specialized application limited to a few administrators. Its auth mode ({leastUsedApp.mode}) has a low success rate, suggesting config issues.</p>
                        </div>
                    </CardContent>
                </Card>
            );

        case 'topTenantsByUser':
            return (
                <Card>
                    <CardHeader>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                            <div>
                                <CardTitle className="flex items-center"><TrendingUp className='w-5 h-5 mr-2 text-emerald-500' /> Top Tenants by Users</CardTitle>
                                <CardDescription>Top tenants for the selected location</CardDescription>
                            </div>
                            <SimpleCustomSelect
                                value={selectedLocation}
                                onChange={(value) => handleLocationChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>)}
                                options={userLocationMarkers?.map((location: any) => ({
                                    name: location.name,
                                    value: location.name
                                })) || []}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                        <div className='w-full flex-1'>
                            <ResponsiveContainer width="100%" height="100%" >
                                <BarChart layout="vertical" data={mockData.tenantsByLocation[selectedLocation!]} margin={{ right: 30, left: 20, top: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" fontSize={12} />
                                    <YAxis type="category" dataKey="name" width={70} fontSize={12} />
                                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} Users`, 'Users']} />
                                    <Bar dataKey="users" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            );

        case 'mostUsedAppByTenants':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-teal-500" /> Tenant using the application most.</CardTitle>
                        <CardDescription>Tenants Using the Application Most in durations</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockData.mostUsedApps} margin={{ right: 30, left: 20, top: 10, bottom: 10 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="time" fontSize={12} height={10} tickFormatter={(value, index) => `${value} ${mockData.mostUsedApps[index].am_pm}`} />
                                    <YAxis fontSize={12} />
                                    <Tooltip
                                        formatter={(value: number, name: string, props: any) => [`${value.toLocaleString()} Users`, props.payload.name]} labelFormatter={(label, payload) => `${label} ${payload?.[0]?.payload.am_pm}`} />
                                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            );

        case 'userLocation':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Map className="w-5 h-5 mr-2 text-teal-500" /> User by Country / State</CardTitle>
                        <CardDescription>Geographical distribution of active users</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                        <GeoMap
                            data={userLocationMarkers}
                            zoom={mapZoom}
                            onZoomIn={handleMapZoomIn}
                            onZoomOut={handleMapZoomOut} />
                    </CardContent>
                </Card>
            );

        case 'logActivity':

            const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
            const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
            const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
            const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
            const [selectedOsBrowsers, setSelectedOsBrowsers] = useState<string[]>([]);
            const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
            const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>({ filterType: 0 });
            const [searchTerm, setSearchTerm] = useState('');

            const locationFilterRef = useRef<HTMLButtonElement>(null);
            const osBrowserFilterRef = useRef<HTMLButtonElement>(null);
            const statusFilterRef = useRef<HTMLButtonElement>(null);
            const dateFilterButtonRef = useRef<HTMLButtonElement>(null);

            const getUniqueValues = (key: keyof typeof mockData.logData[0]): string[] => {
                return Array.from(new Set(mockData.logData.map(log => log[key]))).sort();
            };
            const uniqueLocations = useMemo(() => getUniqueValues('location'), [mockData.logData]);
            const uniqueOsBrowsers = useMemo(() => getUniqueValues('osBrowser'), [mockData.logData]);
            const uniqueStatuses = useMemo(() => ['success', 'failure'], []);

            const displayedLogs = useMemo(() => {
                let filtered = mockData.logData;

                const searchTermLower = searchTerm.toLowerCase();
                if (searchTermLower) {
                    filtered = filtered.filter(log =>
                        log.user.toLowerCase().includes(searchTermLower) ||
                        log.location.toLowerCase().includes(searchTermLower) ||
                        log.osBrowser.toLowerCase().includes(searchTermLower) 
                    );
                }

                if (selectedLocations.length > 0) {
                    filtered = filtered.filter(log => selectedLocations.includes(log.location));
                }
                if (selectedOsBrowsers.length > 0) {
                    filtered = filtered.filter(log => selectedOsBrowsers.includes(log.osBrowser));
                }
                if (selectedStatuses.length > 0) {
                    filtered = filtered.filter(log => selectedStatuses.includes(log.status));
                }


                const { startDate, endDate, filterType } = dateRangeFilter;
                if (filterType !== 0) {

                    filtered = filtered.filter(log => {
                        try {
                            const logDateFormat = 'M/d/yyyy HH:mm:ss';
                            const logDate = parse(log.lastLogin, logDateFormat, new Date());
                            if (isNaN(logDate.getTime())) return false;
                            if (startDate && logDate < startDate) return false;
                            if (endDate && logDate > endDate) return false;
                            return true;
                        } catch (e) {
                            console.error("Date parsing/filtering error:", log.lastLogin, e);
                            return false;
                        }
                    });
                }


                const sorted = [...filtered].sort((a, b) => {
                    try {
                        const dateA = new Date(a.lastLogin).getTime();
                        const dateB = new Date(b.lastLogin).getTime();
                        if (isNaN(dateA) || isNaN(dateB)) return 0;
                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                    } catch (e) { return 0; }
                });

                return sorted;

            }, [
                mockData.logData,
                selectedLocations,
                selectedOsBrowsers,
                selectedStatuses,
                dateRangeFilter,
                sortOrder,
                searchTerm
            ]);

            const handleSort = () => {
                setSortOrder(currentOrder => (currentOrder === 'asc' ? 'desc' : 'asc'));
            };

            const handleFilterIconClick = (column: string) => {
                setOpenFilterColumn(prev => (prev === column ? null : column));
                setIsDatePickerOpen(false);
            };

            const handleFilterSelect = (column: string, values: string[]) => {
                switch (column) {
                    case 'location': setSelectedLocations(values); break;
                    case 'osBrowser': setSelectedOsBrowsers(values); break;
                    case 'status': setSelectedStatuses(values); break;
                }
            };

            const handleDateFilterClick = () => {
                setIsDatePickerOpen(!isDatePickerOpen);
                setOpenFilterColumn(null);
            };

            const getDropdownProps = () => {
                switch (openFilterColumn) {
                    case 'location': return { anchorRef: locationFilterRef, column: 'location', values: uniqueLocations, selectedValues: selectedLocations, onSelect: (vals) => handleFilterSelect('location', vals) };
                    case 'osBrowser': return { anchorRef: osBrowserFilterRef, column: 'osBrowser', values: uniqueOsBrowsers, selectedValues: selectedOsBrowsers, onSelect: (vals) => handleFilterSelect('osBrowser', vals) };
                    case 'status': return { anchorRef: statusFilterRef, column: 'status', values: uniqueStatuses, selectedValues: selectedStatuses, onSelect: (vals) => handleFilterSelect('status', vals) };
                    default: return null;
                }
            };
            const dropdownProps = getDropdownProps();

            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Activity className='w-5 h-5 mr-2 text-teal-500' />
                            User Login/Activity Log
                        </CardTitle>
                        <CardDescription>Recent user authentication activity and system information</CardDescription>
                    <div className='relative flex items-center justify-between mt-4'>
                            <input
                                type='text'
                                placeholder='Search logs ...' 
                                className='w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm shadow-2xs focus:outline-none'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className='absolute left-3 w-5 h-5 text-gray-400 pointer-events-none' /> 
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-x-auto relative">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                        <th className='px-4 py-3 w-1/5'>
                                            <div className="flex items-center justify-between">User</div>
                                        </th>
                                        <th className='px-4 py-3 w-1/5'>
                                            <div className="flex items-center gap-4">
                                                Location
                                                <button ref={locationFilterRef} onClick={() => handleFilterIconClick('location')} className={`p-1 rounded hover:bg-gray-200 ${selectedLocations.length > 0 ? 'text-blue-600 bg-blue-100' : 'text-gray-400'}`}> <Filter size={14} /> </button>
                                            </div>
                                        </th>
                                        <th className='px-4 py-3 w-1/5'>
                                            <div className="flex items-center gap-4">
                                                OS/Browser
                                                <button ref={osBrowserFilterRef} onClick={() => handleFilterIconClick('osBrowser')} className={`p-1 rounded hover:bg-gray-200 ${selectedOsBrowsers.length > 0 ? 'text-blue-600 bg-blue-100' : 'text-gray-400'}`}> <Filter size={14} /> </button>
                                            </div>
                                        </th>
                                        <th className='px-4 py-3 w-1/5'>
                                            <div className="flex items-center gap-4">
                                                    Last Login
                                                <button onClick={handleSort} className="  font-semibold text-gray-700 uppercase">
                                                    <ArrowUpDown className="w-3 h-3 text-gray-400  hover:bg-gray-200" />
                                                </button>
                                                <button
                                                    ref={dateFilterButtonRef}
                                                    onClick={handleDateFilterClick}
                                                    className={`p-1 rounded hover:bg-gray-200 ${dateRangeFilter.filterType !== 0 ? 'text-blue-600 bg-blue-100' : 'text-gray-400'}`}
                                                    title={formatDateRangeDisplay(dateRangeFilter)}
                                                >
                                                    <Filter size={14} />
                                                </button>
                                            </div>
                                        </th>
                                        <th className='px-4 py-3 w-1/5'>
                                            <div className="flex items-center gap-4">
                                                App Response
                                                <button ref={statusFilterRef} onClick={() => handleFilterIconClick('status')} className={`p-1 rounded hover:bg-gray-200 ${selectedStatuses.length > 0 ? 'text-blue-600 bg-blue-100' : 'text-gray-400'}`}> <Filter size={14} /> </button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                    {displayedLogs.length > 0 ? (
                                        displayedLogs.map((log: any, index: number) => (
                                            <tr key={index} className={log.status === 'success' ? 'hover:bg-emerald-50 transition-colors' : 'hover:bg-red-50 transition-colors'}>
                                                <td className="px-4 py-3 font-medium">{log.user}</td>
                                                <td className='px-4 py-3'>{log.location}</td>
                                                <td className='px-4 py-3'>{log.osBrowser}</td>
                                                <td className={`px-4 py-3 font-semibold ${log.status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{log.lastLogin}</td>
                                                <td className={`px-4 py-3 font-semibold ${log.status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{log.response}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-500">
                                                No logs found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                            {dropdownProps && (
                                <ColumnFilterDropdown
                                    {...dropdownProps}
                                    close={() => setOpenFilterColumn(null)}
                                />
                            )}
                            {isDatePickerOpen && (
                                <DateRangePicker
                                    anchorRef={dateFilterButtonRef}
                                    initialRange={dateRangeFilter}
                                    onChange={(newRange) => {
                                        setDateRangeFilter(newRange);
                                    }}
                                    onClose={() => setIsDatePickerOpen(false)}
                                />
                            )}
                    </CardContent>
                </Card>
            );
        default:
            return (
                <Card>
                    <CardHeader> <CardTitle>Unknown Card</CardTitle> </CardHeader>
                    <CardContent> <p>Card ID: {cardId}</p> </CardContent>
                </Card>
            );
    }
};