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
