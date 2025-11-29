import { ReactNode } from "react";

export default function BibleLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-[#0F1433] text-white">
      {children}
    </section>
  );
}

