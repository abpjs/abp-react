# ABP Enhancements — @abpjs/components

This document tracks intentional divergences from the original `@abp/ng.components` (Angular) package.
These changes must be preserved during future translation updates to avoid overwriting our enhancements.

## v3.3.0 — Chakra UI Integration & slotProps

**Original (Angular):** The Tree component renders plain HTML (`<div>`, `<span>`, `<input>`) with
encapsulated SCSS styles in the Angular component.

**Our enhancement:** The Tree component now uses Chakra UI v3 components internally, aligning it with
the rest of the ABP React monorepo's design system.

### Changed files

| File | Change |
|------|--------|
| `src/tree/components/Tree.tsx` | Replaced all HTML elements with Chakra components (Box, Flex, Text, IconButton, Menu, Portal). Removed 100-line inline `<style>` block. Added `TreeSlotProps` type and `slotProps` prop. |
| `package.json` | Added peer deps: `@chakra-ui/react`, `@abpjs/theme-shared`, `react-icons` |
| `tsup.config.ts` | Added Chakra/theme-shared/react-icons to `external` array |

### Element mapping

| Original HTML | Chakra Replacement |
|---|---|
| `<div className="abp-tree">` | `<Box role="tree" colorPalette="blue" fontSize="sm">` |
| `<div className="abp-tree-node">` | `<Box userSelect="none">` |
| `<div className="abp-tree-node-content">` | `<Flex align="center" py="1" px="2" borderRadius="sm" cursor="pointer">` |
| `<span className="abp-tree-switcher">` + `▼/▶` | `<IconButton size="xs" variant="ghost">` + `<LuChevronDown/LuChevronRight>` |
| `<input type="checkbox">` | `<Checkbox>` from `@abpjs/theme-shared` |
| `<span className="abp-tree-title">` | `<Text flex="1" truncate>` |
| Hand-rolled dropdown menu | `<Menu.Root>` + `<Menu.Trigger>` + `<Portal>` + `<Menu.Content>` |
| `<style>{treeStyles}</style>` (100 lines CSS) | Deleted — all styling via Chakra tokens |

### New exports

- `TreeSlotProps` — interface for slot-based customization

### New props on `TreeProps`

- `slotProps?: TreeSlotProps` — granular Chakra-based customization of every visual element
- `className` and `style` marked `@deprecated` (still functional, prefer `slotProps.root`)

### Behavioral changes

- **Context menu:** Previously used `showMenu` state + `onMouseLeave`. Now uses Chakra `Menu.Root`
  with built-in click-to-open and click-outside-to-close behavior (more accessible).
- **Indentation:** Previously `paddingLeft: ${level * 20}px`. Now `pl={${level * 20}px}` — same
  pixel value but uses Chakra's `pl` prop which is RTL-aware (`padding-inline-start`).
- **Selected state styling:** Previously hardcoded `var(--primary-color, #1890ff)`. Now uses Chakra
  `colorPalette.solid` / `colorPalette.contrast` tokens — respects theme and dark mode.
- **Hover state:** Now only applies when node is not selected (prevents visual conflict).
- **Dark mode:** Now works automatically via Chakra semantic tokens.
- **Data attributes:** Added `data-selected`, `data-dragover`, `data-disabled` for styling/testing.
- **Test IDs:** Added `data-testid="tree-node-content-{key}"` on the Flex row element.

### What stays identical to ABP Angular

- All behavioral props: `checkable`, `draggable`, `checkStrictly`, `beforeDrop`, `isNodeSelected`
- Custom template props: `customNodeTemplate`, `expandedIconTemplate` (v3.2.0)
- Event callbacks: `onCheckedKeysChange`, `onExpandedKeysChange`, `onSelectedNodeChange`, `onDrop`
- Generic type parameter: `<T extends BaseNode>`
- Data layer: `TreeAdapter`, `TreeNode`, `BaseNode`, `createTreeFromList`, `createListFromTree`,
  `createMapFromList`, `defaultNameResolver` — all untouched
- `menu` prop API: `(node: TreeNodeData<T>) => React.ReactNode` — render function unchanged

### Migration notes for future ABP updates

When translating a new Angular version's Tree component changes:

1. **Do NOT revert to plain HTML rendering.** Apply any Angular template changes to the Chakra
   component equivalents instead.
2. **Do NOT re-add the `<style>` block.** Map any new CSS rules to Chakra props or `slotProps` slots.
3. **Preserve `TreeSlotProps` and `slotProps` prop.** This is our extension, not from ABP Angular.
4. **Keep peer deps** on `@chakra-ui/react`, `@abpjs/theme-shared`, `react-icons`.
5. **Data layer changes** (TreeAdapter, models, utils) can be translated directly — they have no
   Chakra dependencies.
