import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Cloud Intelligence Platform",
  description: "We commit to strict data handling practices. AWS metadata is securely processed locally and never sold to third parties. We collect only what is expli...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
