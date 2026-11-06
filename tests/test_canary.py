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
    with pytest.raises(ValueError):
        clamp(1, 10, 0)


def test_fizzbuzz_endpoints():
    out = fizzbuzz(15)
    assert out[0] == "1"
    assert out[2] == "fizz"
    assert out[4] == "buzz"
    assert out[14] == "fizzbuzz"
