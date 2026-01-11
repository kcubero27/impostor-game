/**
 * CategorySelection Domain Service
 *
 * Manages business rules for category selection.
 */
export class CategorySelection {
  /**
   * Validates that at least one category is selected
   * If no categories are selected, it means all categories are used
   */
  static hasSelectedCategories(selectedCategoryIds: string[]): boolean {
    return selectedCategoryIds.length > 0;
  }

  /**
   * Gets the count of selected categories
   */
  static getSelectedCount(selectedCategoryIds: string[]): number {
    return selectedCategoryIds.length;
  }

  /**
   * Checks if a category is selected
   */
  static isCategorySelected(
    categoryId: string,
    selectedCategoryIds: string[]
  ): boolean {
    return selectedCategoryIds.includes(categoryId);
  }

  /**
   * Toggles a category selection
   */
  static toggleCategory(
    categoryId: string,
    selectedCategoryIds: string[]
  ): string[] {
    if (CategorySelection.isCategorySelected(categoryId, selectedCategoryIds)) {
      return selectedCategoryIds.filter((id) => id !== categoryId);
    }
    return [...selectedCategoryIds, categoryId];
  }

  /**
   * Selects all categories from the available list
   */
  static selectAll(availableCategoryIds: string[]): string[] {
    return [...availableCategoryIds];
  }

  /**
   * Deselects all categories
   */
  static deselectAll(): string[] {
    return [];
  }
}
