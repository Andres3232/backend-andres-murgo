import { Module } from '@nestjs/common';
import { CategoryTreeService } from './domain/services/category-tree.service';
import { CategoryStoreService } from './domain/services/category-store.service';
import { GetActiveLeafPathsUseCase } from './application/use-cases/get-active-leaf-paths.use-case';
import { FindCategoryByIdUseCase } from './application/use-cases/find-category-by-id.use-case';
import { CategoryController } from './infrastructure/http/category.controller';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryTreeService,
    CategoryStoreService,
    GetActiveLeafPathsUseCase,
    FindCategoryByIdUseCase,
  ],
})
export class CategoryModule {}
