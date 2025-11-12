import { Suspense } from "react";
import ExaltedCharacterManager from "@/components/ExaltedCharacterManager";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ExaltedCharacterManager />
      </Suspense>
    </main>
  );
}
