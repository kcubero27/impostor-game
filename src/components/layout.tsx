import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "@/i18n";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
};

export const Layout = ({ children, title, onBack }: LayoutProps) => {
  const { t } = useTranslation();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-dvh w-full flex flex-col">
        <div className="p-4 pb-0">
          {(title || onBack) && (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-9">
                {onBack && (
                  <Button variant="ghost" size="icon" onClick={onBack}>
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">{t("ui.back")}</span>
                  </Button>
                )}
              </div>
              {title && (
                <h1 className="text-3xl font-bold flex-1 text-center min-w-0">
                  {title}
                </h1>
              )}
              {!title && <div className="flex-1" />}
              <div className="flex-shrink-0 flex items-center gap-2">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
            </div>
          )}
          {!title && !onBack && (
            <div className="flex justify-end items-center gap-2">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col min-h-0 p-4">{children}</div>
      </div>
    </ThemeProvider>
  );
};
