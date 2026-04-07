/**
 * Sanitize user input strings.
 * Strips HTML tags, trims whitespace, enforces max lengths,
 * rejects dangerous patterns.
 */

const DANGEROUS_PATTERN = /<script|javascript:|on\w+=/i;

export function sanitizeString(input: string, maxLength: number = 5000): string {
  if (!input || typeof input !== "string") return "";

  // Strip HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

export function validateInput(input: string): boolean {
  if (!input || typeof input !== "string") return true;
  return !DANGEROUS_PATTERN.test(input);
}

export function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      if (!validateInput(value)) {
        throw new Error(`Invalid input detected in field: ${key}`);
      }
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item, 500) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
