import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/data/categories";
import { useTranslation } from "@/i18n";
import { CategorySelection } from "@/domain/category/category-selection";

type CategoriesSetupProps = {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
};

export const CategoriesSetup = ({
  selectedCategories,
  onCategoriesChange,
}: CategoriesSetupProps) => {
  const { t } = useTranslation();

  const availableCategoryIds = CATEGORIES.map((cat) => cat.id);

  const toggleCategory = (categoryId: string) => {
    const updated = CategorySelection.toggleCategory(
      categoryId,
      selectedCategories
    );
    onCategoriesChange(updated);
  };

  const selectAll = () => {
    const updated = CategorySelection.selectAll(availableCategoryIds);
    onCategoriesChange(updated);
  };

  const deselectAll = () => {
    const updated = CategorySelection.deselectAll();
    onCategoriesChange(updated);
  };

  const allSelected = selectedCategories.length === availableCategoryIds.length;
  const totalCount = availableCategoryIds.length;
  const selectedCount =
    selectedCategories.length === 0 ? totalCount : selectedCategories.length;

  return (
    <div className="container mx-auto flex flex-col h-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("ui.all_categories_selected")}
        </span>
        <Badge variant="secondary">
          {selectedCount}/{totalCount} {t("ui.categories")}
        </Badge>
      </div>
      <div className="flex gap-2 mt-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={allSelected ? deselectAll : selectAll}
          className="flex-1"
        >
          {allSelected ? t("ui.deselect_all") : t("ui.select_all")}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {CATEGORIES.map((category, index) => {
          const isSelected = CategorySelection.isCategorySelected(
            category.id,
            selectedCategories
          );
          return (
            <Card
              key={category.id}
              className={`gap-0 py-0 ${index > 0 ? "mt-2" : ""}`}
            >
              <CardContent className="p-0">
                <div
                  className="flex items-center justify-between gap-2.5 py-2 px-4 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className="text-lg">{category.emoji}</span>
                    <label className="flex-1 text-sm pointer-events-none">
                      {t(category.nameKey)}
                    </label>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
