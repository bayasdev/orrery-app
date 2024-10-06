import { Html, useProgress } from "@react-three/drei";

export default function ModelSuspense() {
  const { progress } = useProgress();
  return <Html>{progress.toFixed(0)}%</Html>;
}
