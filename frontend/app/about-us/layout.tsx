import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Project - Cloud Intelligence Platform",
  description: "CloudIntel began as a capstone initiative to build a transparent, developer-focused FinOps tool. Our vision is to demystify complex billing and provid...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
