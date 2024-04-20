import { useArrayExtensions } from './array-extensions.js';
import { useDateExtensions } from './date-extensions.js';
import { useMapExtensions } from './map-extensions.js';
import { useMathExtensions } from './math-extensions.js';
import { useSetExtensions } from './set-extensions.js';
import { useStringExtensions } from './string-extensions.js';

/**
 * Registriert alle verfügbaren Erweiterungen zu eingebauten Klassen.
 */
export function useAllExtensions(): void {
  useArrayExtensions();
  useDateExtensions();
  useMapExtensions();
  useMathExtensions();
  useSetExtensions();
  useStringExtensions();
}
