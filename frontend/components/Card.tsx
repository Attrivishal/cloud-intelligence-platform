"use client";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-[#1C2128]
        border border-[#232A34]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
