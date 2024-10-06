import { CelestialBody, CelestialBodyType } from "@/types";

// Define planets with moons and distance to Sun
export const planets: CelestialBody[] = [
  {
    name: "Mercury",
    type: CelestialBodyType.Planet,
    color: "#8c7e6a",
    orbitRadius: 50,
    size: 2,
    orbitalPeriod: 88, // in Earth days
    moons: 0,
    distanceToSun: 57.9, // million km
    modelPath: "/models/mercury.glb",
    description:
      "Mercury is a rocky planet with a heavily cratered surface, similar to the Moon. It has virtually no atmosphere, leading to extreme temperature fluctuations. Mercury orbits the Sun every 88 Earth days and has a very slow rotation, completing 1.5 rotations per orbit.",
  },
  {
    name: "Venus",
    type: CelestialBodyType.Planet,
    color: "#e6b88a",
    orbitRadius: 75,
    size: 3,
    orbitalPeriod: 225,
    moons: 0,
    distanceToSun: 108.2,
    modelPath: "/models/venus.glb",
    description:
      "Venus is similar in size and structure to Earth but has a thick, toxic atmosphere composed mainly of carbon dioxide, with clouds of sulfuric acid. It experiences a runaway greenhouse effect, making it the hottest planet in our solar system. Venus has no moons.",
  },
  {
    name: "Earth",
    type: CelestialBodyType.Planet,
    color: "#6b93d6",
    orbitRadius: 100,
    size: 4,
    orbitalPeriod: 365,
    moons: 1,
    distanceToSun: 149.6,
    modelPath: "/models/earth.glb",
    description:
      "Earth is the only known planet to support life, with a diverse ecosystem and liquid water covering about 71% of its surface. It has one natural satellite, the Moon, and orbits the Sun every 365 days.",
  },
  {
    name: "Mars",
    type: CelestialBodyType.Planet,
    color: "#c1440e",
    orbitRadius: 125,
    size: 3,
    orbitalPeriod: 687,
    moons: 2,
    distanceToSun: 227.9,
    modelPath: "/models/mars.glb",
    description:
      "Mars, known as the Red Planet, has a thin atmosphere and surface features reminiscent of both the Moon and Earth, including valleys, deserts, and polar ice caps. It has two small moons, Phobos and Deimos, and takes about 687 Earth days to orbit the Sun.",
  },
];

// Define NEOs with distance to Sun
export const neos: CelestialBody[] = [
  {
    name: "2020 QG",
    type: CelestialBodyType.NearEarthObject,
    color: "#ffd700",
    orbitRadius: 90,
    size: 1,
    orbitalPeriod: 200,
    moons: 0,
    distanceToSun: 150, // Approximate average distance in million km
    description:
      "2020 QG is a small near-Earth object that periodically approaches Earth. It has no moons and varies in distance from the Sun due to its elliptical orbit.",
  },
  {
    name: "99942 Apophis",
    type: CelestialBodyType.NearEarthObject,
    color: "#ff4500",
    orbitRadius: 110,
    size: 1.5,
    orbitalPeriod: 324,
    moons: 0,
    distanceToSun: 180, // Approximate average distance in million km
    description:
      "99942 Apophis is a well-known near-Earth asteroid that gained attention due to its close approaches to Earth. It has no moons and poses no significant threat based on current observations.",
  },
  {
    name: "2021 PH27",
    type: CelestialBodyType.NearEarthObject,
    color: "#00ff00",
    orbitRadius: 140,
    size: 1,
    orbitalPeriod: 113,
    moons: 0,
    distanceToSun: 160, // Approximate average distance in million km
    description:
      "2021 PH27 is a near-Earth object with an elliptical orbit that brings it close to Earth periodically. It lacks any moons and has an average distance to the Sun of approximately 160 million kilometers.",
  },
];
