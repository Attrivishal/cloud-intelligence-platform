import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center - Cloud Intelligence Platform",
  description: "Search our knowledge base for FAQs regarding AWS connectivity, Boto3 integration errors, or dashboard troubleshooting steps....",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
