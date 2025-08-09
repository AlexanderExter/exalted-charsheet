import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          <Link href="/">Exalted: Essence Character Manager</Link>
        </h1>
      </div>
    </header>
  );
}
