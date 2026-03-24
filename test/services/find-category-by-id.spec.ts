import { Category } from '../../src/domain/models/category.model';
import { CategoryTreeService } from '../../src/domain/services/category-tree.service';

describe('CategoryTreeService – findCategoryById (Fase 2)', () => {
  let service: CategoryTreeService;

  beforeEach(() => {
    service = new CategoryTreeService();
  });

  const baseStructure: Category = {
    id: 1,
    name: 'Electrónica',
    active: true,
    subcategories: [
      {
        id: 2,
        name: 'Computadoras',
        active: true,
        subcategories: [
          { id: 5, name: 'Laptops', active: true, subcategories: [] },
          { id: 6, name: 'Desktops', active: false, subcategories: [] },
        ],
      },
      { id: 3, name: 'Celulares', active: true, subcategories: [] },
      { id: 4, name: 'Accesorios', active: true, subcategories: [] },
    ],
  };

  it('should find a leaf node and return correct metadata (example from spec)', () => {
    const result = service.findCategoryById(baseStructure, 5);

    expect(result).not.toBeNull();
    expect(result!.node.id).toBe(5);
    expect(result!.node.name).toBe('Laptops');
    expect(result!.path).toBe('Electrónica/Computadoras/Laptops');
    expect(result!.depth).toBe(2);
    expect(result!.parentId).toBe(2);
    expect(result!.isLeaf).toBe(true);
  });

  it('should find the root node with parentId null and depth 0', () => {
    const result = service.findCategoryById(baseStructure, 1);

    expect(result).not.toBeNull();
    expect(result!.node.id).toBe(1);
    expect(result!.path).toBe('Electrónica');
    expect(result!.depth).toBe(0);
    expect(result!.parentId).toBeNull();
    expect(result!.isLeaf).toBe(false);
  });

  it('should find an intermediate node (not a leaf)', () => {
    const result = service.findCategoryById(baseStructure, 2);

    expect(result).not.toBeNull();
    expect(result!.node.id).toBe(2);
    expect(result!.path).toBe('Electrónica/Computadoras');
    expect(result!.depth).toBe(1);
    expect(result!.parentId).toBe(1);
    expect(result!.isLeaf).toBe(false);
  });

  it('should find an inactive node (search is not filtered by active)', () => {
    const result = service.findCategoryById(baseStructure, 6);

    expect(result).not.toBeNull();
    expect(result!.node.id).toBe(6);
    expect(result!.node.active).toBe(false);
    expect(result!.path).toBe('Electrónica/Computadoras/Desktops');
    expect(result!.depth).toBe(2);
    expect(result!.parentId).toBe(2);
    expect(result!.isLeaf).toBe(true);
  });

  it('should return null when the ID does not exist', () => {
    const result = service.findCategoryById(baseStructure, 999);

    expect(result).toBeNull();
  });

  it('should find a node in a deeply nested structure', () => {
    const deep: Category = {
      id: 1,
      name: 'A',
      active: true,
      subcategories: [
        {
          id: 2,
          name: 'B',
          active: true,
          subcategories: [
            {
              id: 3,
              name: 'C',
              active: true,
              subcategories: [
                { id: 4, name: 'D', active: true, subcategories: [] },
              ],
            },
          ],
        },
      ],
    };

    const result = service.findCategoryById(deep, 4);

    expect(result).not.toBeNull();
    expect(result!.path).toBe('A/B/C/D');
    expect(result!.depth).toBe(3);
    expect(result!.parentId).toBe(3);
    expect(result!.isLeaf).toBe(true);
  });

  it('should return correct isLeaf=false for a node that has subcategories', () => {
    const result = service.findCategoryById(baseStructure, 2);

    expect(result!.isLeaf).toBe(false);
  });

  it('should find a first-level child correctly', () => {
    const result = service.findCategoryById(baseStructure, 3);

    expect(result).not.toBeNull();
    expect(result!.path).toBe('Electrónica/Celulares');
    expect(result!.depth).toBe(1);
    expect(result!.parentId).toBe(1);
    expect(result!.isLeaf).toBe(true);
  });
});
