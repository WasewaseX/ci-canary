// Reference functions for the master-ci consumer canary.
// Small on purpose: they give the linter and the built-in test runner
// honest work without pulling in any dependency.

export function slugify(input) {
	return input
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function chunk(list, size) {
	if (size < 1) {
		throw new RangeError("size must be at least 1");
	}
	const out = [];
	for (let i = 0; i < list.length; i += size) {
		out.push(list.slice(i, i + size));
	}
	return out;
}

export function tail(list, n) {
	if (n < 0) {
		throw new RangeError("n must not be negative");
	}
	return list.slice(Math.max(list.length - n, 0));
}

export function clamp(value, low, high) {
	if (low > high) {
		throw new RangeError("low must not exceed high");
	}
	return Math.max(low, Math.min(high, value));
}
