import { Word } from "./word.entity";

export interface IWordRepository {
  getAllWords(): Word[];

  getAvailableWords(usedWordIds: Set<string>): Word[];

  getWordsByCategories(
    selectedCategoryIds: string[],
    usedWordIds: Set<string>
  ): Word[];

  getWordsByCategoriesAndDifficulty(
    selectedCategoryIds: string[],
    usedWordIds: Set<string>,
    difficulty: number | null
  ): Word[];
}
