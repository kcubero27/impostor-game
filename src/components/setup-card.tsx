import { Card, CardContent } from "@/components/ui/card";
import { TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SetupCardProps = {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function SetupCard({
  icon,
  iconBg,
  title,
  subtitle,
  right,
  onClick,
  className,
}: SetupCardProps) {
  return (
    <Card
      className={cn(
        "rounded-xl p-0",
        onClick && "cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-white",
                iconBg
              )}
            >
              {icon}
            </div>
            <div>
              <div className="text-base font-medium">{title}</div>
              {subtitle && (
                <TypographyMuted className="text-sm">
                  {subtitle}
                </TypographyMuted>
              )}
            </div>
          </div>
          {right}
        </div>
      </CardContent>
    </Card>
  );
}
