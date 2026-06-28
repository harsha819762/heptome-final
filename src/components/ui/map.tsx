"use client";

import React, { useCallback, useState } from "react";
import MapGL, { ViewStateChangeEvent } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MapViewport {
  center: [number, number]; // [lng, lat]
  zoom: number;
  bearing: number;
  pitch: number;
}

interface MapProps {
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  className?: string;
}

export function Map({ viewport, onViewportChange, className }: MapProps) {
  // Use a default open-source map style
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
    <div className={cn("relative w-full h-full", className)}>
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
      />
    </div>
  );
}
