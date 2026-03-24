import { Module } from '@nestjs/common';
import { GetActiveLeafPathsUseCase } from './application/use-cases/get-active-leaf-paths.use-case';

@Module({
  providers: [GetActiveLeafPathsUseCase],
  exports: [GetActiveLeafPathsUseCase],
})
export class CategoryModule {}
