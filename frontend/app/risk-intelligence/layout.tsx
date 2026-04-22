import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Intelligence - Cloud Intelligence Platform",
  description: "Automated analysis of your resources to find security vulnerabilities, misconfigurations, and idle assets. We evaluate instances for low CPU utilizati...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
