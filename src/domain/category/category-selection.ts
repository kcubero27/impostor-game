export class CategorySelection {
  static getSelectedCount(selectedCategoryIds: string[]): number {
    return selectedCategoryIds.length;
  }

  static isCategorySelected(
    categoryId: string,
    selectedCategoryIds: string[]
  ): boolean {
    return selectedCategoryIds.includes(categoryId);
  }

  static toggleCategory(
    categoryId: string,
    selectedCategoryIds: string[]
  ): string[] {
    if (CategorySelection.isCategorySelected(categoryId, selectedCategoryIds)) {
      return selectedCategoryIds.filter((id) => id !== categoryId);
    }
    return [...selectedCategoryIds, categoryId];
  }

  static selectAll(availableCategoryIds: string[]): string[] {
    return [...availableCategoryIds];
  }

  static deselectAll(): string[] {
    return [];
  }
}
