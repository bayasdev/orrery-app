"use client";

import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ModelLoaderProps {
  modelPath: string;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ modelPath }) => {
  const gltf = useGLTF(modelPath);

  // Compute the bounding box of the model
  const box = new THREE.Box3().setFromObject(gltf.scene);

  // Center the model manually based on its bounding box
  const center = new THREE.Vector3();
  box.getCenter(center);
  gltf.scene.position.sub(center);

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = 5 / maxAxis;
  gltf.scene.scale.set(scale, scale, scale);

  // Rotate the model continuously
  useFrame(() => {
    gltf.scene.rotation.y += 0.005;
  });

  return <primitive object={gltf.scene} />;
};

export default ModelLoader;
