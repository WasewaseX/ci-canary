// Workspace member exercising master-ci's project discovery: this
// directory exists because the root package.json declares packages/*,
// so the node stack must install, lint and test it as its own project.

export function snakeCase(input) {
  return input
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function unique(values) {
  return [...new Set(values)];
}

export function truncate(input, max) {
  if (!Number.isInteger(max) || max < 1) {
    throw new RangeError("max must be a positive integer");
  }
  return input.length <= max ? input : `${input.slice(0, max)}...`;
}

export function chunk(values, size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer");
  }
  const pages = [];
  for (let index = 0; index < values.length; index += size) {
    pages.push(values.slice(index, index + size));
  }
  return pages;
}
