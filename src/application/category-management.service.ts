import { CategorySelection } from "@/domain/category/category-selection";

/**
 * CategoryManagementService
 *
 * Application service that orchestrates category selection use cases.
 */
export class CategoryManagementService {
  /**
   * Toggles a category selection
   */
  toggleCategory(categoryId: string, selectedCategoryIds: string[]): string[] {
    return CategorySelection.toggleCategory(categoryId, selectedCategoryIds);
  }

  /**
   * Selects all categories
   */
  selectAll(availableCategoryIds: string[]): string[] {
    return CategorySelection.selectAll(availableCategoryIds);
  }

  /**
   * Deselects all categories
   */
  deselectAll(): string[] {
    return CategorySelection.deselectAll();
  }

  /**
   * Gets the count of selected categories
   */
  getSelectedCount(selectedCategoryIds: string[]): number {
    return CategorySelection.getSelectedCount(selectedCategoryIds);
  }

  /**
   * Checks if a category is selected
   */
  isCategorySelected(
    categoryId: string,
    selectedCategoryIds: string[]
  ): boolean {
    return CategorySelection.isCategorySelected(
      categoryId,
      selectedCategoryIds
    );
  }
}
