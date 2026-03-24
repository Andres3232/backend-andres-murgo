import { Category } from '../models/category.model';
import { FindCategoryResult } from '../types/find-result.types';

export class CategoryTreeService {
  /**
   * Devuelve todas las rutas completas de las categorías hoja activas,
   * ordenadas alfabéticamente.
   *
   * Reglas:
   * - Solo aparecen nodos hoja activos.
   * - Si un nodo o alguno de sus ancestros está inactivo, la rama se descarta.
   *
   * Complejidad temporal: O(n) recorrido + O(k log k) sort, donde k = hojas activas.
   * Complejidad espacial: O(n) por el stack de recursión + paths acumulados.
   */
  getActiveLeafPaths(root: Category): string[] {
    const paths: string[] = [];
    this.collectActiveLeafPaths(root, [], paths);
    return paths.sort();
  }

  /**
   * DFS recursivo que acumula el path y colecta hojas activas.
   * Corta la rama si el nodo es inactivo.
   */
  private collectActiveLeafPaths(
    node: Category,
    currentPath: string[],
    results: string[],
  ): void {
    if (!node.active) {
      return;
    }

    const pathWithCurrent = [...currentPath, node.name];
    const isLeaf = !node.subcategories || node.subcategories.length === 0;

    if (isLeaf) {
      results.push(pathWithCurrent.join('/'));
      return;
    }

    for (const child of node.subcategories) {
      this.collectActiveLeafPaths(child, pathWithCurrent, results);
    }
  }

  /**
   * Busca una categoría por ID en cualquier nivel del árbol.
   *
   * Retorna:
   * - node     : el nodo encontrado
   * - path     : ruta completa desde la raíz (ej. "Electrónica/Computadoras/Laptops")
   * - depth    : profundidad (0 = raíz)
   * - parentId : id del padre, o null si el nodo es la raíz
   * - isLeaf   : true si el nodo no tiene subcategorías
   *
   * Si el ID no existe retorna null.
   *
   * Complejidad temporal: O(n) en peor caso (recorre todo el árbol).
   * Complejidad espacial: O(d) donde d = profundidad del nodo encontrado.
   */
  findCategoryById(root: Category, id: number): FindCategoryResult | null {
    return this.searchById(root, id, [], 0, null);
  }

  /**
   * DFS recursivo que lleva el path acumulado, la profundidad y el parentId.
   * Retorna el resultado en cuanto encuentra el ID; null si no lo encuentra.
   */
  private searchById(
    node: Category,
    id: number,
    currentPath: string[],
    depth: number,
    parentId: number | null,
  ): FindCategoryResult | null {
    const pathWithCurrent = [...currentPath, node.name];

    if (node.id === id) {
      return {
        node,
        path: pathWithCurrent.join('/'),
        depth,
        parentId,
        isLeaf: !node.subcategories || node.subcategories.length === 0,
      };
    }

    if (!node.subcategories || node.subcategories.length === 0) {
      return null;
    }

    for (const child of node.subcategories) {
      const result = this.searchById(
        child,
        id,
        pathWithCurrent,
        depth + 1,
        node.id,
      );
      if (result !== null) {
        return result;
      }
    }

    return null;
  }
}
