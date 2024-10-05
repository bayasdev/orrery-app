"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
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
import { CelestialBody } from "./Orrery";
import PlanetModel from "./PlanetModel";

interface PlanetDialogProps {
  open: boolean;
  planet: CelestialBody;
  onClose: () => void;
}

const PlanetDialogComponent: React.FC<PlanetDialogProps> = ({
  planet,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{planet.name}</DialogTitle>
          <DialogDescription>Planet: {planet.name}</DialogDescription>
        </DialogHeader>
        {planet.modelPath && (
          <div className="grid gap-4 py-4">
            <Canvas
              style={{ width: "100%", height: "500px" }}
              camera={{ position: [0, 0, 10], near: 0.1, far: 1000, fov: 50 }}
              gl={{ toneMappingExposure: 1.5 }}
            >
              <Environment preset="sunset" />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 10]} intensity={2} />
              <pointLight position={[-10, -10, -10]} intensity={1} />
              <Suspense fallback={null}>
                <Bounds fit clip observe margin={1}>
                  <PlanetModel modelPath={planet.modelPath} />
                </Bounds>
              </Suspense>
              <OrbitControls enableZoom={true} />
            </Canvas>
          </div>
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

const PlanetDialog = dynamic(() => Promise.resolve(PlanetDialogComponent), {
  ssr: false,
});

export default PlanetDialog;
