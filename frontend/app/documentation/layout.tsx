import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - Cloud Intelligence Platform",
  description: "Explore our comprehensive guides to learn how to connect your AWS accounts securely, configure synchronization schedules, and interpret dashboard anal...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
