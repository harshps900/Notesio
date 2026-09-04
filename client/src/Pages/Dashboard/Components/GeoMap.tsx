import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';

interface GeoMapProps {
    data: any[];
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface TooltipPosition {
    x: number;
    y: number;
}

export const GeoMap: React.FC<GeoMapProps> = ({ data, zoom, onZoomIn, onZoomOut }) => {
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);

    const showTooltip = (evt: React.MouseEvent, name: string, users: number) => {
        const { clientX, clientY } = evt;
        const containerRect = evt.currentTarget.closest('.relative')?.getBoundingClientRect();
        if (containerRect) {
            setTooltipPosition({ x: clientX - containerRect.left, y: clientY - containerRect.top });
            setTooltipContent(`${name}: ${users.toLocaleString()} users`);
        }
    };

    const hideTooltip = () => {
        setTooltipContent(null);
        setTooltipPosition(null);
    };

    return (
        <div className="h-full w-full relative">
            {tooltipContent && tooltipPosition && (
                <div
                    className="bg-gray-800 text-white text-xs rounded-md py-2 px-3 shadow-lg"
                    style={{
                        position: 'absolute',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -150%)',
                        zIndex: 9999,
                    }}>
                    {tooltipContent}
                </div>
            )}
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }} style={{ width: '100%', height: '100%' }}>
                <ZoomableGroup center={[-100, 39]} zoom={zoom}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) => geographies.map((geo: any) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#f2f3f4"
                                stroke="#696969"
                                strokeWidth={0.2}
                                style={{ default: { outline: 'none' }, hover: { fill: '#4169e1', outline: 'none' }, pressed: { fill: '#BBB', outline: 'none' } }}
                                // ADDED: onClick and onMouseEnter to hide tooltip when on map bg
                                onClick={hideTooltip}
                                onMouseEnter={hideTooltip}
                            />
                        ))}
                    </Geographies>
                    {data && data.map(({ name, coordinates, users, color }) => (
                        <Marker key={name} coordinates={coordinates as [number, number]}>
                            <g
                                // UPDATED: Use helper function for hover
                                onMouseEnter={(evt) => showTooltip(evt, name, users)}
                                // ADDED: Use same helper function for click/tap
                                onClick={(evt) => showTooltip(evt, name, users)}
                                // UPDATED: Use helper function for mouse out
                                onMouseLeave={hideTooltip}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle
                                    r={Math.sqrt(users) / 2.5}
                                    fill={color}
                                    stroke="#fff"
                                    strokeWidth={1}
                                />
                            </g>
                        </Marker>
                    ))}
                </ZoomableGroup>
            </ComposableMap>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button onClick={onZoomIn} className="w-8 h-8 bg-white border rounded-md shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100"><span className="text-xl font-semibold">+</span></button>
                <button onClick={onZoomOut} className="w-8 h-8 bg-white border rounded-md shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100"><span className="text-2xl font-semibold">-</span></button>
            </div>
        </div>
    );
};
