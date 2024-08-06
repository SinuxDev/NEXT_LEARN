import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default async function Home() {
  return (
    <main className="text-4xl">
      <h1>Hello There </h1>
      <Button variant="destructive">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
      </Button>
    </main>
  );
}
