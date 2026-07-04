"use client";

import React, { useCallback } from "react";
import MapGL, { Marker, ViewStateChangeEvent } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface MapMarker {
  longitude: number;
  latitude: number;
  label?: string;
  color?: string;
  pulse?: boolean;
}

interface MapProps {
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  markers?: MapMarker[];
  className?: string;
}

export function Map({ viewport, onViewportChange, markers, className }: MapProps) {
  const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      onViewportChange({
        center: [evt.viewState.longitude, evt.viewState.latitude],
        zoom: evt.viewState.zoom,
        bearing: evt.viewState.bearing,
        pitch: evt.viewState.pitch,
      });
    },
    [onViewportChange]
  );

  return (
    <div className={`relative w-full h-full ${className || ""}`}>
      <MapGL
        mapLib={maplibregl as any}
        longitude={viewport.center[0]}
        latitude={viewport.center[1]}
        zoom={viewport.zoom}
        bearing={viewport.bearing}
        pitch={viewport.pitch}
        onMove={handleMove}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
      >
        {markers?.map((m, i) => (
          <Marker key={i} longitude={m.longitude} latitude={m.latitude} anchor="center">
            <div className="relative flex flex-col items-center">
              {m.pulse && (
                <div className="w-5 h-5 rounded-full border-2 border-white shadow-md absolute animate-ping"
                  style={{ backgroundColor: m.color || "#2563EB" }} />
              )}
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[8px] font-black relative"
                style={{ backgroundColor: m.color || "#2563EB" }}>
                {i === 0 ? "C" : "T"}
              </div>
              {m.label && (
                <span className="absolute -bottom-4 text-[9px] font-bold text-gray-700 bg-white/90 px-1 rounded whitespace-nowrap shadow-xs">
                  {m.label}
                </span>
              )}
            </div>
          </Marker>
        ))}
      </MapGL>
    </div>
  );
}
