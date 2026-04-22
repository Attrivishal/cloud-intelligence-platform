import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference - Cloud Intelligence Platform",
  description: "Detailed documentation for developers looking to integrate with our FastAPI backend. Explore endpoints for retrieving instance metadata, updating cost...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
