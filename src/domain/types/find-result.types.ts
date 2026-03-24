import { Category } from '../models/category.model';

export interface FindCategoryResult {
  node: Category;
  path: string;
  depth: number;
  parentId: number | null;
  isLeaf: boolean;
}
