import { OrbitIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const NoSelectedCelestialBodyCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nothing selected</CardTitle>
        <CardDescription>Try clicking on a celestial body</CardDescription>
      </CardHeader>
      <CardContent>
        <OrbitIcon size={64} />
      </CardContent>
    </Card>
  );
};

export default NoSelectedCelestialBodyCard;
