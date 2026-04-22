import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Cloud Intelligence Platform",
  description: "By utilizing this platform, you agree to our terms. The tool is provided as open-source software without guarantees. Always verify recommendations bef...",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
