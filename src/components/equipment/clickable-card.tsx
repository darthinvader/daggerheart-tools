interface ClickableCardProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ClickableCard({
  onClick,
  children,
  disabled = false,
}: ClickableCardProps) {
  if (disabled) return <>{children}</>;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="block h-full w-full cursor-pointer text-left transition-all hover:scale-[1.01] hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      {children}
    </div>
  );
}
