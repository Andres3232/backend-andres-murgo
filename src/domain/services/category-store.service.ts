import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Category } from '../models/category.model';

@Injectable()
export class CategoryStoreService {
  private readonly tree: Category;

  constructor() {
    const filePath = join(process.cwd(), 'data', 'categories.json');
    this.tree = JSON.parse(readFileSync(filePath, 'utf-8')) as Category;
  }

  getTree(): Category {
    return this.tree;
  }
}
