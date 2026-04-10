"use client";

export default function Card({ children }: any) {
  return (
    <div className="bg-[#0F1E35] border border-white/5 rounded-xl p-6 shadow-sm">
      {children}
    </div>
  );
}
