import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support - Cloud Intelligence Platform",
  description: "Need technical assistance? Our engineering team is standing by to help with IAM configurations, deployment issues, or customized compliance reports....",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
