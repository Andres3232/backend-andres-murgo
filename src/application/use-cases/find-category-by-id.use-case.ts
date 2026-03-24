import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/models/category.model';
import { FindCategoryResult } from '../../domain/types/find-result.types';
import { CategoryTreeService } from '../../domain/services/category-tree.service';

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(private readonly treeService: CategoryTreeService) {}

  execute(root: Category, id: number): FindCategoryResult | null {
    return this.treeService.findCategoryById(root, id);
  }
}
