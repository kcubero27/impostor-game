import { Button } from "@/components/ui/button";
import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import { useTranslation } from "@/i18n";

export const HomePage = ({ onInitGame }: { onInitGame: () => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <TypographyH1>{t("ui.find_impostor")}</TypographyH1>

        <Button className="w-full max-w-lg" onClick={onInitGame}>
          {t("ui.start_game")}
        </Button>
      </div>

      <div className="flex justify-center">
        <TypographySmall>{t("ui.copyright")}</TypographySmall>
      </div>
    </>
  );
};
