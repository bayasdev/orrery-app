"use client";

import { BoxIcon, PauseCircleIcon, Volume2Icon } from "lucide-react";
import { CelestialBody } from "./Orrery";
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

interface PlanetCardProps {
  planet: CelestialBody;
  onOpen: () => void;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ planet, onOpen }) => {
  const {
    ttsChildren,
    play,
    pause,
    state: { isPlaying },
  } = useTts({
    children: planet.description,
    markTextAsSpoken: true,
  });

  return (
    <Card key={planet.name}>
      <CardHeader>
        <CardTitle>{planet.name}</CardTitle>
        <CardDescription>{planet.type}</CardDescription>
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
      <CardContent className="flex flex-col gap-2">
        <div>
          <p>Orbit Radius: {planet.orbitRadius} million km</p>
          <p>Size: {planet.size * 10} km</p>
          <p>Speed: {planet.speed * 1000} km/s</p>
        </div>
        {planet.description && (
          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p>{ttsChildren}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanetCard;
