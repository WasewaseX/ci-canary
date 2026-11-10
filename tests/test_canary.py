"""Tests for the canary reference functions."""

import pytest

from canary import clamp, fizzbuzz, word_count


def test_word_count_is_case_folded():
    assert word_count("To be or not to be") == {"to": 2, "be": 2, "or": 1, "not": 1}


def test_word_count_empty_input():
    assert word_count("") == {}


def test_clamp_inside_bounds():
    assert clamp(5, 0, 10) == 5
    assert clamp(-1, 0, 10) == 0
    assert clamp(11, 0, 10) == 10


def test_clamp_rejects_swapped_bounds():
    # The message is part of the contract and anchored on purpose: a
    # mangled or decorated message must not pass the same way a silent
    # one would. Mutation testing (v2.9.0 exercise) found the gap.
    with pytest.raises(ValueError, match=r"^low must not exceed high$"):
        clamp(1, 10, 0)


def test_clamp_allows_equal_bounds():
    """A degenerate closed interval is valid: the guard rejects only
    low > high, so low == high must pass through unchanged."""
    assert clamp(5, 5, 5) == 5


def test_fizzbuzz_full_sequence():
    """The exact 15-row table pins the range's upper bound as hard as
    its entries: an off-by-one range must not sneak an extra row past
    the endpoint checks (mutation testing found exactly that gap)."""
    assert fizzbuzz(15) == [
        "1",
        "2",
        "fizz",
        "4",
        "buzz",
        "fizz",
        "7",
        "8",
        "fizz",
        "buzz",
        "11",
        "fizz",
        "13",
        "14",
        "fizzbuzz",
    ]


def test_fizzbuzz_endpoints():
    out = fizzbuzz(15)
    assert out[0] == "1"
    assert out[2] == "fizz"
    assert out[4] == "buzz"
    assert out[14] == "fizzbuzz"


def test_interleave_keeps_both_tails():
    from canary import interleave

    assert interleave(["a", "b"], ["1"]) == ["a", "1", "b"]
    assert interleave([], ["1", "2"]) == ["1", "2"]


def test_running_total_accumulates():
    from canary import running_total

    assert running_total([1, 2, 3]) == [1.0, 3.0, 6.0]
    assert running_total([]) == []
