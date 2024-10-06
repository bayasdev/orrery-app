"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CelestialBodyDialog from "./CelestialBodyDialog";
import { PauseCircleIcon, PlayCircleIcon } from "lucide-react";
import CelestialBodyCard from "./CelestialBodyCard";
import { CelestialBodyWithPosition } from "@/types";
import { neos, planets } from "@/lib/data";
import NoSelectedCelestialBodyCard from "./NoSelectedCelestialBodyCard";
import { useWidth } from "@/lib/hooks";

const OrreryComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const celestialBodiesRef = useRef<CelestialBodyWithPosition[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedBody, setSelectedBody] =
    useState<CelestialBodyWithPosition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const width = useWidth();

  // Track hovered celestial body and mouse position
  const [hoveredBody, setHoveredBody] =
    useState<CelestialBodyWithPosition | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Scale factors
  const planetSizeScaleFactor = width < 768 ? 1 : 2;
  const orbitRadiusScaleFactor = width < 768 ? 1 : 1.5;

  // Time tracking
  const lastTimeRef = useRef(0); // in milliseconds
  const elapsedTimeRef = useRef(0); // in seconds

  // Time scale to speed up the simulation
  const timeScale = 100000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    // Initial resize
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const render = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      // Calculate deltaTime in seconds
      const deltaTimeMs = time - lastTimeRef.current;
      const deltaTimeSec = deltaTimeMs / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        elapsedTimeRef.current += deltaTimeSec * timeScale;
      }

      // Ensure canvas size matches the displayed size
      resizeCanvas();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Sun at the center
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#FDB813";
      ctx.fill();

      // Store positions of celestial bodies
      celestialBodiesRef.current = [];

      // Draw orbits and planets/NEOs
      [...planets, ...neos].forEach((body) => {
        const scaledOrbitRadius = body.orbitRadius * orbitRadiusScaleFactor;

        // Draw orbit
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          scaledOrbitRadius,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.stroke();

        // Calculate angle based on elapsed time and orbital period
        const orbitalPeriodSeconds = body.orbitalPeriod * 86400; // days to seconds
        const angle =
          (elapsedTimeRef.current / orbitalPeriodSeconds) * 2 * Math.PI;
        const x = canvas.width / 2 + Math.cos(angle) * scaledOrbitRadius;
        const y = canvas.height / 2 + Math.sin(angle) * scaledOrbitRadius;

        // Store position
        celestialBodiesRef.current.push({ ...body, x, y });

        // Draw planet/NEO with scaled size
        ctx.beginPath();
        ctx.arc(x, y, body.size * planetSizeScaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();

        // Highlight if selected
        if (selectedBody && selectedBody.name === body.name) {
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, body.size * planetSizeScaleFactor + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, orbitRadiusScaleFactor, planetSizeScaleFactor, selectedBody]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on any celestial body
    const clickedBody = celestialBodiesRef.current.find((body) => {
      const dx = x - body.x;
      const dy = y - body.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= body.size * planetSizeScaleFactor + 2;
    });

    if (clickedBody) {
      setSelectedBody(clickedBody);
    } else {
      setSelectedBody(null);
    }
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update mouse position relative to the parent container
    const parentRect = canvas.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setMousePosition({
        x: event.clientX - parentRect.left,
        y: event.clientY - parentRect.top,
      });
    }

    // Check if mouse is over any celestial body
    const hovered = celestialBodiesRef.current.find((body) => {
      const dx = x - body.x;
      const dy = y - body.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= body.size * planetSizeScaleFactor + 2;
    });

    if (hovered) {
      setHoveredBody(hovered);
    } else {
      setHoveredBody(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredBody(null);
    setMousePosition(null);
  };

  return (
    <>
      {dialogOpen && selectedBody && (
        <CelestialBodyDialog
          open={dialogOpen}
          celestialBody={selectedBody}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-600 bg-gray-900 rounded-lg w-full"
          style={{ height: "600px" }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {hoveredBody && mousePosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y + 10,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "5px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {hoveredBody.name}
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <Button onClick={handlePlayPause} variant="outline" size="sm">
            {isPlaying ? (
              <PauseCircleIcon size={16} className="mr-2" />
            ) : (
              <PlayCircleIcon size={16} className="mr-2" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>
      {selectedBody ? (
        <CelestialBodyCard
          celestialBody={selectedBody}
          onOpen={() => setDialogOpen(true)}
        />
      ) : (
        <NoSelectedCelestialBodyCard />
      )}
    </>
  );
};

export default OrreryComponent;
