import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infrastructure - Cloud Intelligence Platform",
  description: "Our platform provides comprehensive, real-time visibility into your AWS infrastructure. Syncing via Boto3, we pull detailed metadata about your EC2 in...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
