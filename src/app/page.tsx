import Orrery from "@/components/Orrery";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-screen p-4">
      <div>
        <h1 className="text-3xl font-bold">Orrery with Near-Earth Objects</h1>
        <h2 className="text-lg font-medium text-muted-foreground">
          Astro Ingenieros
        </h2>
      </div>
      <Orrery />
    </div>
  );
}
