export function calculateCode(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .replace(/\s/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-")
    .toLowerCase(); // Convert to lowercase;
}
