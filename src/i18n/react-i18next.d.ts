import "react-i18next";
import type { TranslationResource } from "./locales";

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: TranslationResource;
    };
    defaultNS: "translation";
  }
}
