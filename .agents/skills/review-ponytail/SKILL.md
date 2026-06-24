---
name: review-ponytail
description: Run a ponytail-review (over-engineering pass) on local code changes.
---

# Review Ponytail

Use when the user asks to run `/review-ponytail` or wants a ponytail complexity review.

## Steps

1. Read `.agents/skills/ponytail-review/SKILL.md` for format and boundaries.
2. Run `git diff` and `git diff --cached`. If the user named a scope, limit to those paths.
3. Review **only** unnecessary complexity — not correctness, security, or performance.
4. Output one line per finding: `L<line>: <tag> <what>. <replacement>.`
5. End with `net: -<N> lines possible.` or `Lean already. Ship.`
6. Do **not** apply fixes unless the user asks.

## Diff scope

| User intent | Diff |
|-------------|------|
| Default | Uncommitted + staged + branch changes vs merge-base |
| "uncommitted only" / "dirty" | `git diff` + `git diff --cached` only |
| Named paths | Restrict review to those paths |
