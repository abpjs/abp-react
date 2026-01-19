import { useMemo } from 'react';
import { useSession } from './useSession';
import { isRtlLanguage, getTextDirection } from '../utils/rtl';

/** Physical side: 'left' or 'right' */
export type PhysicalSide = 'left' | 'right';

/**
 * Hook to get the text direction based on current language.
 * Returns 'rtl' for RTL languages (Arabic, Hebrew, Persian, etc.) and 'ltr' otherwise.
 *
 * Also provides helper properties for positioning elements based on direction:
 * - `startSide` / `endSide`: The physical side that corresponds to start/end in current direction
 * - `menuPlacementStart` / `menuPlacementEnd`: Chakra menu placement values
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { direction, isRtl, endSide } = useDirection();
 *
 *   return (
 *     <div dir={direction}>
 *       <Menu.Root positioning={{ placement: `${endSide}-start` }}>
 *         ...
 *       </Menu.Root>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDirection() {
  const { language } = useSession();

  const isRtl = useMemo(() => isRtlLanguage(language), [language]);
  const direction = useMemo(() => getTextDirection(language), [language]);

  // Physical sides based on direction
  // In LTR: start=left, end=right
  // In RTL: start=right, end=left
  const startSide: PhysicalSide = isRtl ? 'right' : 'left';
  const endSide: PhysicalSide = isRtl ? 'left' : 'right';

  return {
    /** Current text direction: 'rtl' or 'ltr' */
    direction,
    /** Whether the current language is RTL */
    isRtl,
    /** Current language code */
    language,
    /** Physical side for 'start' (LTR: left, RTL: right) */
    startSide,
    /** Physical side for 'end' (LTR: right, RTL: left) */
    endSide,
  };
}
