import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { FindCategoryByIdUseCase } from '../../application/use-cases/find-category-by-id.use-case';
import { GetActiveLeafPathsUseCase } from '../../application/use-cases/get-active-leaf-paths.use-case';
import { CategoryStoreService } from '../../domain/services/category-store.service';
import type { FindCategoryResult } from '../../domain/types/find-result.types';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly store: CategoryStoreService,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly getActiveLeafPathsUseCase: GetActiveLeafPathsUseCase,
  ) {}

  @Get('active-leaf-paths')
  getActiveLeafPaths(): string[] {
    return this.getActiveLeafPathsUseCase.execute(this.store.getTree());
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): FindCategoryResult {
    const result = this.findCategoryByIdUseCase.execute(
      this.store.getTree(),
      id,
    );

    if (result === null) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return result;
  }
}
