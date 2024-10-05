"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlanetDialog from "./PlanetDialog";
import { BoxIcon } from "lucide-react";

// Define types for celestial bodies
export type CelestialBody = {
  name: string;
  color: string;
  orbitRadius: number;
  size: number;
  speed: number;
  modelPath?: string;
  description?: string;
};

type CelestialBodyWithPosition = CelestialBody & {
  x: number;
  y: number;
};

// Define planets and NEOs
const planets: CelestialBody[] = [
  {
    name: "Mercury",
    color: "#8c7e6a",
    orbitRadius: 50,
    size: 2,
    speed: 0.02,
    modelPath: "/models/mercury.glb",
    description:
      "Es un planeta rocoso con una gran cantidad de cráteres en su superficie. A pesar de su proximidad al Sol, no es el planeta más caliente, ya que casi no tiene atmósfera que retenga el calor. Durante el día, sus temperaturas alcanzan los 430 °C, pero descienden bruscamente a -185 °C por la noche. La gravedad en Mercurio es de 3,7 m/s², lo que hace que los objetos pesen un 62% menos que en la Tierra. Además, gira a gran velocidad, tardando solo 88 días terrestres en completar una órbita alrededor del Sol. Curiosamente, durante este tiempo, Mercurio solo logra girar sobre su propio eje 1,5 veces. Carece de estaciones, ya que su eje de inclinación es apenas de 2º.",
  },
  {
    name: "Venus",
    color: "#e6b88a",
    orbitRadius: 75,
    size: 3,
    speed: 0.015,
    modelPath: "/models/venus.glb",
  },
  {
    name: "Earth",
    color: "#6b93d6",
    orbitRadius: 100,
    size: 4,
    speed: 0.01,
    modelPath: "/models/earth.glb",
  },
  {
    name: "Mars",
    color: "#c1440e",
    orbitRadius: 125,
    size: 3,
    speed: 0.008,
    modelPath: "/models/mars.glb",
  },
];

const neos: CelestialBody[] = [
  { name: "2020 QG", color: "#ffd700", orbitRadius: 90, size: 1, speed: 0.03 },
  {
    name: "99942 Apophis",
    color: "#ff4500",
    orbitRadius: 110,
    size: 1.5,
    speed: 0.025,
  },
  {
    name: "2021 PH27",
    color: "#00ff00",
    orbitRadius: 140,
    size: 1,
    speed: 0.02,
  },
];

export default function Orrery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const celestialBodiesRef = useRef<CelestialBodyWithPosition[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedBody, setSelectedBody] =
    useState<CelestialBodyWithPosition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // New state variables for tooltip
  const [hoveredBody, setHoveredBody] =
    useState<CelestialBodyWithPosition | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      if (!isPlaying) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Sun
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#FDB813";
      ctx.fill();

      // Store positions of celestial bodies
      celestialBodiesRef.current = [];

      // Draw orbits and planets/NEOs
      [...planets, ...neos].forEach((body) => {
        // Draw orbit
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          body.orbitRadius,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.stroke();

        // Calculate position with speed multiplier
        const angle = time * body.speed * 0.05;
        const x = canvas.width / 2 + Math.cos(angle) * body.orbitRadius;
        const y = canvas.height / 2 + Math.sin(angle) * body.orbitRadius;

        // Store position
        celestialBodiesRef.current.push({ ...body, x, y });

        // Draw planet/NEO
        ctx.beginPath();
        ctx.arc(x, y, body.size, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();

        // Highlight if selected
        if (selectedBody && selectedBody.name === body.name) {
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, body.size + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, selectedBody]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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
      return distance <= body.size + 2; // Add some tolerance
    });

    if (clickedBody) {
      setSelectedBody(clickedBody);
    } else {
      setSelectedBody(null);
    }
  };

  // New handler for mouse movement
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
      return distance <= body.size + 2; // Add some tolerance
    });

    if (hovered) {
      setHoveredBody(hovered);
    } else {
      setHoveredBody(null);
    }
  };

  // Handle mouse leaving the canvas
  const handleMouseLeave = () => {
    setHoveredBody(null);
    setMousePosition(null);
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen p-4">
      {dialogOpen && selectedBody && (
        <PlanetDialog
          open={dialogOpen}
          planet={selectedBody}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <div>
        <h1 className="text-3xl font-bold">Orrery with Near-Earth Objects</h1>
        <h2 className="text-xl font-bold">Astro Ingenieros</h2>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          // rectangle
          width={1200}
          height={600}
          className="border border-gray-600 bg-gray-900 rounded-lg mx-auto"
          // vertically center this canvas
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {/* Tooltip */}
        {hoveredBody && mousePosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: mousePosition.x + 10, // Offset tooltip position
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
        <div className="absolute top-2 flex items-center space-x-2">
          <Button onClick={handlePlayPause} variant="outline" size="sm">
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>
      {selectedBody && (
        <div className="mt-4 flex flex-col gap-1">
          <h2 className="text-xl font-bold">
            Selected Body: {selectedBody.name}
          </h2>
          <p>Orbit Radius: {selectedBody.orbitRadius} million km</p>
          <p>Size: {selectedBody.size * 10} km</p>
          <p>Speed: {selectedBody.speed * 1000} km/s</p>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="self-start"
          >
            <BoxIcon size={16} className="mr-2" />
            View in 3D
          </Button>
          <p>{selectedBody.description}</p>
        </div>
      )}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {neos.map((neo) => (
          <Card key={neo.name}>
            <CardHeader>
              <CardTitle>{neo.name}</CardTitle>
              <CardDescription>Near-Earth Object</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Orbit Radius: {neo.orbitRadius} million km</p>
              <p>Size: {neo.size * 10} km</p>
              <p>Speed: {neo.speed * 1000} km/s</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
