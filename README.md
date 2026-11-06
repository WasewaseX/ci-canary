# ci-canary

An independent consumer canary for
[WasewaseX/master-ci](https://github.com/WasewaseX/master-ci).

This repository exists to answer one question from the outside: when a real
project that nobody develops together with the template calls master-ci as a
reusable workflow, does everything work? It is a small, dependency-free
polyglot project (Python + Node) with the one-line consumer setup that the
template advertises in `examples/ci.yml`.

What it proves, on a schedule, in GitHub's own infrastructure:

- cross-repository reusable workflow calls resolve and run
- stack auto-detection picks up Python and Node on a foreign tree
- the helper fetch is reproducible: the workflow ref, `template_repo` and
  `template_ref` are all pinned to an exact release tag, never a mutable branch
- the zero-configuration path needs no secrets beyond `GITHUB_TOKEN`
- the full default check set passes on a clean, dependency-free project

The workflow below is deliberately pinned to `v1.8.2` instead of the `@v1`
major tag. Consumers who want automatic updates should keep `@v1` and let
Dependabot bump it; the canary wants the opposite property: a fixed,
reproducible baseline whose drift is visible. The watchdog workflow in
master-ci reads this pin, compares it against the newest released tag, and
reports the lag, so a stale pin is information rather than a silent choice.

## Layout

| Path | Purpose |
| --- | --- |
| `canary.py`, `tests/` | Python module with pytest coverage |
| `index.js`, `test/` | Node module with `node --test` coverage |
| `.github/workflows/ci.yml` | The whole consumer setup: one `uses:` line |

There are no runtime dependencies anywhere. Python installs through
`pip install -e .` from a dependency-free `pyproject.toml`, Node tests run
on the built-in runner from Node 22, so the canary exercises the pipeline
without ever resolving a package from a registry.
