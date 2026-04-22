import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Framework - Cloud Intelligence Platform",
  description: "Security is non-negotiable. Our platform operates strictly on ReadOnlyAccess IAM policies. All transit is encrypted via TLS 1.3, and database operatio...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
