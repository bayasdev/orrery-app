"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ModelLoader from "./ModelLoader";
import ModelSuspense from "./ModelSuspense";
import { CelestialBody } from "@/types";

interface CelestialBodyDialogProps {
  open: boolean;
  onClose: () => void;
  celestialBody: CelestialBody;
}

const CelestialBodyDialog: React.FC<CelestialBodyDialogProps> = ({
  open,
  onClose,
  celestialBody,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{celestialBody.name}</DialogTitle>
          <DialogDescription>{celestialBody.description}</DialogDescription>
        </DialogHeader>
        {celestialBody.modelPath && (
          <Canvas
            style={{ width: "100%", height: "500px" }}
            camera={{ position: [0, 0, 10], near: 0.1, far: 1000, fov: 50 }}
            gl={{ toneMappingExposure: 1.5 }}
          >
            <Environment preset="sunset" />
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={1} />
            <Suspense fallback={<ModelSuspense />}>
              <Bounds fit clip observe margin={1}>
                <ModelLoader modelPath={celestialBody.modelPath} />
              </Bounds>
            </Suspense>
            <OrbitControls enableZoom={false} />
          </Canvas>
        )}
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CelestialBodyDialog;
