'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function SimpleMapBackground() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
        const mapStyle = apiKey
            ? `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${apiKey}`
            : 'https://demotiles.maplibre.org/style.json';

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [-9.1393, 38.7223], // Lisbon default
            zoom: 12,
            interactive: false, // Disable interaction for background
            attributionControl: false,
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            className="fixed inset-0 z-0 opacity-50" // High transparency for background effect
            style={{ pointerEvents: 'none' }}
        />
    );
}
