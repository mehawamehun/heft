export type ClassValue = string | false | null | undefined;

/** Joins conditional class names without pulling in a dependency. */
export function cx(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}
