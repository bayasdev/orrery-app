export enum CelestialBodyType {
  Planet = "Planet",
  NearEarthObject = "Near-Earth Object",
}

export type CelestialBody = {
  name: string;
  type: CelestialBodyType;
  color: string;
  orbitRadius: number;
  orbitalPeriod: number;
  size: number;
  moons: number;
  distanceToSun: number;
  modelPath?: string;
  description?: string;
};

export type CelestialBodyWithPosition = CelestialBody & {
  x: number;
  y: number;
};
