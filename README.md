
## Instrucciones de ejecución

### Requisitos

- Node.js >= 18
- npm >= 9

### Instalación

```bash
npm install
```

### Correr los tests

```bash
# Todos los tests
npm test

# En modo watch
npm run test:watch

# Con cobertura
npm run test:cov
```

---

## Fases completadas

- ✅ **Fase 1** – `getActiveLeafPaths`: devuelve todas las rutas completas de hojas activas, ordenadas alfabéticamente.
- ✅ **Fase 2** – `findCategoryById`: busca un nodo por ID y retorna metadata completa (path, depth, parentId, isLeaf).

---

## Estructura del proyecto

```
src/
├── domain/                        # Lógica pura, sin dependencias de framework
│   ├── models/
│   │   └── category.model.ts      # Interface Category
│   ├── services/
│   │   ├── category-tree.service.ts
│   │   └── __tests__/
│   │       ├── get-active-leaf-paths.spec.ts
│   │       └── find-category-by-id.spec.ts
│   └── types/
│       └── find-result.types.ts   # Interface FindCategoryResult
│
└── application/                   # Casos de uso inyectables (NestJS)
    └── use-cases/
        ├── get-active-leaf-paths.use-case.ts
        └── find-category-by-id.use-case.ts
```

---

## Supuestos tomados

- **`findCategoryById` no filtra por `active`**: la búsqueda por ID es una operación estructural, no de filtro por estado. Un nodo inactivo puede ser buscado y encontrado.
- **La raíz es un único nodo**: no se contempla un array de raíces, siempre se recibe un único nodo raíz.
- **`isLeaf` se evalúa por `subcategories` vacío o ausente**: un nodo es hoja si no tiene hijos, independientemente de si está activo o no.
- **Orden alfabético en Fase 1**: se ordena sobre los paths completos como strings, no nodo por nodo dentro del árbol.

---

## Decisiones principales

### Arquitectura hexagonal

Se separó el código en capas:

- **`domain/`**: lógica pura de negocio, sin dependencias de NestJS. Es la parte más importante y la que se testea directamente.
- **`application/`**: casos de uso que orquestan la lógica de dominio. Son clases inyectables de NestJS pero delegan toda la lógica al servicio de dominio.
- **`infrastructure/`** *(previsto para fases siguientes)*: controllers HTTP, adaptadores externos.

### DFS recursivo (Fases 1 y 2)

Se eligió recursión para mayor claridad de lectura. El path se acumula como array de strings y se convierte a string con `/` solo al final, evitando concatenaciones intermedias.

### `null` como resultado de "no encontrado"

En `findCategoryById`, cuando el ID no existe se retorna `null` en lugar de lanzar una excepción. Es un resultado esperado y válido, no un error del sistema.

### Inmutabilidad del path acumulado

En cada llamada recursiva se crea un nuevo array `[...currentPath, node.name]` en lugar de mutar el array del nivel padre. Esto evita efectos secundarios entre ramas del árbol.
