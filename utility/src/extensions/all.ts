import { useArrayExtensions } from './array-extensions';
import { useDateExtensions } from './date-extensions';
import { useMapExtensions } from './map-extensions';
import { useMathExtensions } from './math-extensions';
import { useSetExtensions } from './set-extensions';
import { useStringExtensions } from './string-extensions';

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
