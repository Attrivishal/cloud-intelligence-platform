import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimization - Cloud Intelligence Platform",
  description: "Transform findings into action. Our engine provides contextual recommendations to right-size instances, terminate unused resources, and utilize more c...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
