"""Reference functions for the master-ci consumer canary.

Small on purpose: the canary exercises the CI pipeline, not algorithmic
depth. Every function is pure, documented, and covered by the tests in
``tests/`` so the lint, type, dead-code, complexity and test stages of the
reusable workflow all have honest work to do.
"""


def word_count(text: str) -> dict[str, int]:
    """Count whitespace-separated words, case-folded.

    Words are split on any whitespace run and compared lowercased, so
    "To be" and "to be" produce the same counts.
    """
    counts: dict[str, int] = {}
    for word in text.split():
        key = word.lower()
        counts[key] = counts.get(key, 0) + 1
    return counts


def clamp(value: float, low: float, high: float) -> float:
    """Clamp ``value`` into the closed interval [low, high]."""
    if low > high:
        raise ValueError("low must not exceed high")
    return max(low, min(high, value))


def fizzbuzz(n: int) -> list[str]:
    """Classic fizzbuzz for 1..n inclusive."""
    out: list[str] = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append("fizzbuzz")
        elif i % 3 == 0:
            out.append("fizz")
        elif i % 5 == 0:
            out.append("buzz")
        else:
            out.append(str(i))
    return out


def interleave(a: list[str], b: list[str]) -> list[str]:
    """Zip two lists, keeping the tail of the longer one."""
    out: list[str] = []
    for i in range(max(len(a), len(b))):
        if i < len(a):
            out.append(a[i])
        if i < len(b):
            out.append(b[i])
    return out


def running_total(values: list[float]) -> list[float]:
    """Cumulative sums of a sequence."""
    out: list[float] = []
    acc = 0.0
    for v in values:
        acc += v
        out.append(acc)
    return out
