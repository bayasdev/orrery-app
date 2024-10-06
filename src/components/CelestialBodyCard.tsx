"use client";

import { BoxIcon, PauseCircleIcon, Volume2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useTts } from "tts-react";
import { CelestialBody } from "@/types";

interface CelestialBodyCardProps {
  celestialBody: CelestialBody;
  onOpen: () => void;
}

const CelestialBodyCard: React.FC<CelestialBodyCardProps> = ({
  celestialBody,
  onOpen,
}) => {
  const {
    ttsChildren,
    play,
    pause,
    state: { isPlaying },
  } = useTts({
    children: celestialBody.description,
    markTextAsSpoken: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{celestialBody.name}</CardTitle>
        <CardDescription>{celestialBody.type}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button onClick={onOpen} size="sm">
          <BoxIcon size={16} className="mr-2" />
          View in 3D
        </Button>
        <Button variant="outline" size="sm" onClick={isPlaying ? pause : play}>
          {isPlaying ? (
            <PauseCircleIcon size={16} className="mr-2" />
          ) : (
            <Volume2Icon size={16} className="mr-2" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </CardFooter>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold">Details</h2>
          <p>Orbit Radius: {celestialBody.orbitRadius} million km</p>
          <p>Orbital Period: {celestialBody.orbitalPeriod} days</p>
          <p>Distance to Sun: {celestialBody.distanceToSun} million km</p>
          <p>Moons: {celestialBody.moons}</p>
        </div>
        {celestialBody.description && (
          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p>{ttsChildren}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CelestialBodyCard;
