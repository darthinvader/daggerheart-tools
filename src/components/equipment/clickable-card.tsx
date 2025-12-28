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
    <button
      type="button"
      onClick={onClick}
      className="block w-full cursor-pointer text-left transition-all hover:scale-[1.01] hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      {children}
    </button>
  );
}
