import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cost Analytics - Cloud Intelligence Platform",
  description: "Advanced ML models analyze your usage patterns to precisely forecast future cloud expenditures. Track daily spend across services and regions to elimi...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
