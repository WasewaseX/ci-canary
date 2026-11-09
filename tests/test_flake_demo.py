"""The controlled flake the hunt quarantines.

This test is the canary's flake-hunt proof. It fails exactly when the
hunt sets ``FLAKE_HUNT_ITERATION`` to an odd iteration and passes
otherwise. Routine CI never sets the variable, so the suite is green on
every push; inside the hunt the verdict flips between iterations -
pass, fail, pass - the precise signature the flake hunt exists to
catch. The committed `.flaky-baseline.json` quarantines it, which
proves grandfathering end to end: the weekly hunt reports this test
without failing, and a second, unlisted flaky test would fail the run.
"""

import os


def test_verdict_flips_only_inside_the_hunt():
    iteration = os.environ.get("FLAKE_HUNT_ITERATION")
    assert iteration is None or int(iteration) % 2 == 0, (
        f"iteration {iteration} fails by design (odd iterations flake)"
    )
