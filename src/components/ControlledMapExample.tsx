"use client";

import { useState } from "react";
import { Map, type MapViewport } from "@/components/ui/map";

export function ControlledMapExample() {
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-74.006, 40.7128],
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  return (
    <div className="relative h-[420px] w-full">
      <Map viewport={viewport} onViewportChange={setViewport} />
      <div className="bg-white/80 absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border border-gray-200 px-2 py-1.5 font-mono text-xs backdrop-blur text-black">
        <span>
          <span className="text-gray-500">lng:</span>{" "}
          {viewport.center[0].toFixed(3)}
        </span>
        <span>
          <span className="text-gray-500">lat:</span>{" "}
          {viewport.center[1].toFixed(3)}
        </span>
        <span>
          <span className="text-gray-500">zoom:</span>{" "}
          {viewport.zoom.toFixed(1)}
        </span>
        <span>
          <span className="text-gray-500">bearing:</span>{" "}
          {viewport.bearing.toFixed(1)}°
        </span>
        <span>
          <span className="text-gray-500">pitch:</span>{" "}
          {viewport.pitch.toFixed(1)}°
        </span>
      </div>
    </div>
  );
}
