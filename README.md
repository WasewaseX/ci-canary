# ci-canary

An independent consumer canary for
[WasewaseX/master-ci](https://github.com/WasewaseX/master-ci).

This repository exists to answer one question from the outside: when a real
project that nobody develops together with the template calls master-ci as a
reusable workflow, does everything work? It is a small, honest polyglot
project spanning all ten stacks the template ships, with the one-line
consumer setup that the template advertises in `examples/ci.yml`.

What it proves, on a schedule, in GitHub's own infrastructure:

- cross-repository reusable workflow calls resolve and run
- stack auto-detection picks up every stack it touches on a foreign tree
- the helper fetch is reproducible: the workflow ref, `template_repo` and
  `template_ref` are all pinned to an exact release tag, never a mutable branch
- the zero-configuration path needs no secrets beyond `GITHUB_TOKEN`
- the full default check set passes on a clean, dependency-free project

The v1.9.2 validation run was the first real execution of the six new
stacks anywhere: Maven verify on JDK 21, CMake + ctest, xunit on .NET 10,
RSpec 3.13, PHPUnit 11, and a Dockerfile through hadolint, docker build
and Trivy. The template's hygiene gate caught two genuine fixture
violations on that push (odd XML padding, a missing include) - the fence
works on a foreign tree.

The workflow below is deliberately pinned to an exact tag (`v1.9.2`)
instead of the `@v1` major tag. Consumers who want automatic updates should
keep `@v1` and let Dependabot bump it; the canary wants the opposite
property: a fixed, reproducible baseline whose drift is visible. The
watchdog workflow in master-ci reads this pin, compares it against the
newest released tag, and reports the lag, so a stale pin is information
rather than a silent choice.

## Layout

| Path                        | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `canary.py`, `tests/`       | Python module with pytest coverage              |
| `index.js`, `test/`         | Node module with `node --test` coverage         |
| `pom.xml`, `src/`           | JVM fixture: Maven verify, JUnit 5 on JDK 21    |
| `CMakeLists.txt`, `cpp/`    | C fixture: CMake build, ctest                   |
| `Canary.csproj`             | .NET fixture: xunit on the pinned SDK           |
| `Gemfile`, `lib/`, `spec/`  | Ruby fixture: RSpec                             |
| `composer.json`, `php-src/` | PHP fixture: PHPUnit 11                         |
| `Dockerfile`                | Container fixture: hadolint, build, Trivy scan  |
| `.github/workflows/ci.yml`  | The whole consumer setup: one `uses:` line      |

There are no runtime dependencies anywhere. Python installs through
`pip install -e .` from a dependency-free `pyproject.toml`, Node tests run
on the built-in runner from Node 22. The JVM fixture resolves its test
toolchain through Maven on the first run and caches it; every other stack
uses toolchains preinstalled on the runner.

The quality ratchet floor (`.quality-baseline.json`) is zero findings
in every check, verified against master-ci v2.2.0 over all ten stacks.

The flake hunt (`.flaky-baseline.json`, `flaky.yml`) is the v2.3.0
exercise: `tests/test_flake_demo.py` fails exactly on the hunt's odd
iterations, so three repetitions see pass/fail/pass and the committed
quarantine grandfather it - parser, classifier and baseline semantics
proven on real runners. Routine CI never sets `FLAKE_HUNT_ITERATION`,
so the demo is an ordinary passing test everywhere else.

The quarantine loop is the v2.4.0 exercise: the hunt's copy now
reports its machine verdict and builds a candidate baseline when new
flakes appear in enforcement mode, and the `quarantine` job
re-verifies the candidate against the default branch before opening or
updating the `ci/flake-quarantine` PR - append-only, bounded by
`add-paths` to the baseline file, never a push to main. The demo flake
stays quarantined, so routine hunts report `quarantined-only`: no
proposal, no PR. A second, unlisted flaky test would fail the hunt and
produce the evidence-backed PR in the same run.

The v2.7.0 exercise ("the semantic eye") was the first hosted CodeQL run:
the caller's `ci.yml` calls `codeql.yml` with an explicit
`languages: python` and `queries: security-extended` - the tree is
deliberately polyglot, so `auto` would fan out to eight autobuild jobs.
`codeql / prepare` and `codeql / analyze (python)` both passed, and the
dashboard row is verified from the caller's files, not declared.

The template's own CI went red on the v2.7.0 push in four independent
ways; v2.7.1 fixed all four, and the canary inherited one of them
(shellcheck on the runner now flags the hunt's intentionally-split
variables). The v2.7.1 exercise mirrors the repairs and moves every pin
to the exact `v2.7.1` tag.

The follow-up taught a zizmor lesson: while the workflow-level
`pull-requests` and `id-token` grants were the only permission statement
in the file, the audit passed them; once the codeql job carried its own
permissions block, the workflow-level writes became overly broad at high
confidence. `ci.yml` now scopes per job - `contents: read` at the
workflow level, elevated scopes on exactly the jobs that need them - and
zizmor reports no findings. This branch exists to exercise the one
surface a push cannot reach: the dashboard's computed
"Semantic analysis (CodeQL)" row, which renders only on pull requests.

And the exercise earned its keep twice over: the hosted PR run caught a
genuine template defect no push could have reached - the new-code gate's
merge-base diff is structurally impossible on a pull_request checkout,
where the runner fetches the merge ref at depth 1 and neither side
carries the common history (exit 128 on `origin/main...HEAD`). Template
v2.7.2 adds a tree-diff fallback in the shared diff: on a merge ref the
tree already contains the base branch, so the two-dot diff is exactly
the change under review; both failing still fails closed. This PR
exercises that fallback on a real runner, with the dashboard row
("armed via own workflow") rendered from the caller's checkout.

Template v2.8.0 ("the unblindable gate") closed the audit's four P0
defects, and this repository now exercises the biggest one hosted: its
`ci.yml` calls `required-quality.yml` - the caller-level aggregate whose
gate job is green only when master-ci AND CodeQL both succeeded. Before
v2.8.0, branch protection requiring `ci-success` alone could never fail
on a red CodeQL analysis, because CodeQL rode a separate workflow. The
new-code gate also reports the analysis state of every changed
file now: parsed, no functions, excluded, unsupported language,
parse failure - and a parse failure under a requested ceiling is
exit 2, never a silent pass. This PR is that aggregate's first
foreign exercise.

Template v2.8.1 ("the name of the check") documents what this
repository's own hosted runs proved: a job-called reusable workflow
reports its checks as `<caller job id> / <job id>` - this repo's PR #2
runs show `required / gate`, `required / master / new-code-gate` and
`required / codeql / analyze (python)`, because this file names its
aggregate job `required`. The template README now states that rule
with this repository as evidence, and names its example caller job
`required-quality-check` so its documented string is right by
construction. This exercise bumps every pin to v2.8.1 and re-verifies
the aggregate against the release tag.

Template v2.9.0 ("the callable proof") makes `mutation.yml` the
template's third reusable workflow and the first scheduled one that is
callable: this repository adopts it with a thin wrapper owning the
schedule trigger (Mondays 04:40, one step behind the flake hunt) that
calls `mutation.yml` with explicit, pinned helper refs, and opts in by
declaration - `[tool.mutmut]` scoped to `canary.py`. The first run
earned its keep before it ever went hosted: 70 mutants, 5 survivors,
all genuine assertion gaps (clamp's guard accepted `low >= high` with
no equal-bounds test, the ValueError message was unpinned, fizzbuzz's
range grew by one past the endpoint checks). The strengthened suite -
anchored message match, equal-bounds pass-through, the full 15-row
table - kills all 70, and the dashboard's Mutation testing row flips
to "armed via own workflow - `mutation.yml` calls `mutation.yml`": the
template's second verified row, proven by a grep of this branch's
workflow files, visible in PR #4's dashboard comment.

And the exercise caught a template bug, exactly as designed: PR #4 was
this repository's first python-stack PR beside a helper checkout, and
the hosted ruff lint flagged I001 on `_ci/scripts/discover_projects.py`,
the template's own helpers judged by this repo's copied default config. Template v2.9.1 ("the invisible helpers") makes the transient
`_ci` checkout invisible to the consumer's python stack (default ruff
config exclusion, mypy scan exclusion matching what vulture, lizard
and the mypy file probe already declared). PR #4's re-run went green
on the fixed default, the hosted dispatch of the mutation wrapper
killed 70/70 mutants on main, and every pin rides v2.9.1.

Template v2.10.0 ("the reusable hunt") completes the trilogy: every
opt-in surface in the template - CodeQL, mutation testing, the flake
hunt - is one pinned `uses:` line, nothing copied whole. This
repository deletes the 472-line `flaky.yml` copy it had carried since
the v2.3 exercise and adopts the hunt through a thin wrapper that owns
the schedule trigger (Mondays 04:20, between the template's own 04:00
hunt and the mutation wrapper at 04:40). The Flake hunt row in the
Test assurance table is the template's third verified row: PR #5's
dashboard comment rendered it as "armed via own workflow -
`flaky.yml` calls `flaky.yml`", read from this branch's workflow
files exactly like the CodeQL and Mutation testing rows before it.

And the exercise earned its keep twice in one day. The first hosted
dispatch of the wrapper died as a `startup_failure` with zero jobs -
the called quarantine job declares `contents: write` and
`pull-requests: write`, and a reusable call that grants less than its
callee declares never starts, before any step could explain itself;
the wrapper now grants the scopes on the calling job (the same rule
`ci.yml` already satisfies for the aggregate), and the committed
baseline still decides whether the loop ever fires. The second
dispatch started, ran nine language hunters to their verdicts, and
died in `ruby/setup-ruby`: the action fails closed without
`ruby-version` when the repository commits neither `.ruby-version` nor
`.tool-versions`, and this tree has a Gemfile with no version file -
the template itself has no Gemfile, so its own runs never reach the
step. Template v2.10.1 ("the call that never starts") writes both laws
down: the grant rule in the README example and checks.md, the pinned
`ruby-version: '3.4'` in the hunt's Ruby step, and two contract tests
so neither can regress. Every pin rides v2.10.1.
