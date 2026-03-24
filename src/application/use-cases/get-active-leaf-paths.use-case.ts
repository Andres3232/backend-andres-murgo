import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/models/category.model';
import { CategoryTreeService } from '../../domain/services/category-tree.service';

@Injectable()
export class GetActiveLeafPathsUseCase {
  constructor(private readonly treeService: CategoryTreeService) {}

  execute(root: Category): string[] {
    return this.treeService.getActiveLeafPaths(root);
  }
}
