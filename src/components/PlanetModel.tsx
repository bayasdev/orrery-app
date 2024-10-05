"use client";

import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PlanetModelProps {
  modelPath: string;
}

const PlanetModel: React.FC<PlanetModelProps> = ({ modelPath }) => {
  const gltf = useGLTF(modelPath);
  console.log("Loaded GLTF:", gltf);

  // Compute the bounding box of the model
  const box = new THREE.Box3().setFromObject(gltf.scene);
  console.log("BoundingBox:", box);

  // Center the model manually based on its bounding box
  const center = new THREE.Vector3();
  box.getCenter(center);
  gltf.scene.position.sub(center); // Reposition to center

  // Adjust the scale if the model is too big or too small
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = 5 / maxAxis; // Adjust the denominator to control the size
  gltf.scene.scale.set(scale, scale, scale);

  // Optionally, rotate the model continuously
  useFrame(() => {
    gltf.scene.rotation.y += 0.005;
  });

  return <primitive object={gltf.scene} />;
};

export default PlanetModel;
