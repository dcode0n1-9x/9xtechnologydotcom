interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
  as?: "section" | "article" | "div";
}

export function SurfaceCard({ children, className = "", labelledBy, as: Tag = "section" }: SurfaceCardProps) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={`rounded-2xl border border-line bg-surface/90 p-4 shadow-[0_8px_30px_-12px] shadow-canvas ${className}`}
    >
      {children}
    </Tag>
  );
}
