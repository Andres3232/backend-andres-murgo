import { Category } from '../../models/category.model';
import { CategoryTreeService } from '../category-tree.service';

describe('CategoryTreeService – getActiveLeafPaths (Fase 1)', () => {
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

  it('should return active leaf paths sorted alphabetically', () => {
    const result = service.getActiveLeafPaths(baseStructure);

    expect(result).toEqual([
      'Electrónica/Accesorios',
      'Electrónica/Celulares',
      'Electrónica/Computadoras/Laptops',
    ]);
  });

  it('should exclude branches where an ancestor is inactive', () => {
    const structure: Category = {
      id: 1,
      name: 'Root',
      active: true,
      subcategories: [
        {
          id: 2,
          name: 'Inactivo',
          active: false,
          subcategories: [
            { id: 3, name: 'Hijo', active: true, subcategories: [] },
          ],
        },
        { id: 4, name: 'Activo', active: true, subcategories: [] },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(['Root/Activo']);
  });

  it('should return empty array when root is inactive', () => {
    const structure: Category = {
      id: 1,
      name: 'Root',
      active: false,
      subcategories: [{ id: 2, name: 'Hijo', active: true, subcategories: [] }],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual([]);
  });

  it('should return root name when root is an active leaf', () => {
    const structure: Category = {
      id: 1,
      name: 'Sola',
      active: true,
      subcategories: [],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(['Sola']);
  });

  it('should handle deeply nested structures', () => {
    const structure: Category = {
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

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(['A/B/C/D']);
  });

  it('should not consider a node as leaf if it has active children', () => {
    const structure: Category = {
      id: 1,
      name: 'Root',
      active: true,
      subcategories: [
        {
          id: 2,
          name: 'Parent',
          active: true,
          subcategories: [
            { id: 3, name: 'Child', active: true, subcategories: [] },
          ],
        },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    // "Parent" no es hoja, solo "Child" aparece
    expect(result).toEqual(['Root/Parent/Child']);
  });

  it('should exclude all inactive leaves but include active siblings', () => {
    const structure: Category = {
      id: 1,
      name: 'Tienda',
      active: true,
      subcategories: [
        { id: 2, name: 'Zapatos', active: false, subcategories: [] },
        { id: 3, name: 'Ropa', active: true, subcategories: [] },
        { id: 4, name: 'Sombreros', active: false, subcategories: [] },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(['Tienda/Ropa']);
  });

  it('should return paths in alphabetical order regardless of tree order', () => {
    const structure: Category = {
      id: 1,
      name: 'Root',
      active: true,
      subcategories: [
        { id: 2, name: 'Zebra', active: true, subcategories: [] },
        { id: 3, name: 'Alpha', active: true, subcategories: [] },
        { id: 4, name: 'Mango', active: true, subcategories: [] },
      ],
    };

    const result = service.getActiveLeafPaths(structure);

    expect(result).toEqual(['Root/Alpha', 'Root/Mango', 'Root/Zebra']);
  });
});
