# Shared AI skills — pinned opt-in integration

This repository keeps its existing skills, prompts, AGENTS.md and build conventions. Additional reusable adapters are exposed for **Codex** (`.agents/skills/`) and **Claude Code** (`.claude/skills/`).

| Skill | Where to start | Canonical upstream | Local availability |
| --- | --- | --- | --- |
| 3Dviz Pro Max | `.agents/skills/3dviz-pro-max/SKILL.md` | [viettranx/3dviz-pro-max](https://github.com/viettranx/3dviz-pro-max) (MIT, `d077e0e68915c25be8e71d74684d3144fd1c2aca`) | Use the existing `.ai-tools/3dviz-pro-max/skill/` install or the pinned Git submodule |
| Game-dev router | `.agents/skills/gamedev-router/SKILL.md` | [gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) (Apache-2.0, `c6ca6c41c839b68319ffc08430b99ab768debc32`) | Prefer local project game-dev skills; otherwise pinned Git submodule |
| Spec Kit readiness | `.agents/skills/speckit-router/SKILL.md` | [github/spec-kit](https://github.com/github/spec-kit) (MIT) | Follow the project's existing `.ai-tools/README.md` and real `.specify/` setup |
| Game-dev disciplines | `.agents/skills/router/SKILL.md` | Same GameDev revision as the router above | Twelve adapters share the single `.ai-tools/gamedev-skills/upstream/` catalogue |
| CodeGraph | `.agents/skills/codegraph/SKILL.md` | [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) (MIT) | Optional local CLI/MCP; keep generated indexes out of Git |
| Sand3D | `.agents/skills/sand3d/SKILL.md` | [Sandflow-ai/sand3d](https://github.com/Sandflow-ai/sand3d) (Apache-2.0, guide for v1.6.3) | Optional isolated Python environment; no runtime dependency |
| SpriteCast | `.agents/skills/spritecast/SKILL.md` | [Sunghwan0112/spritecast](https://github.com/Sunghwan0112/spritecast) (MIT, guide checked against v0.26.0) | Optional full upstream plugin; the adapter does not include generation tools |

To fetch the **two full external skill catalogs** after cloning (the remote packages are *not* vendored into this repository's Git history):

```sh
git submodule update --init .ai-tools/3dviz-pro-max/upstream .ai-tools/gamedev-skills/upstream
```

Check that their `SKILL.md` files exist at the paths described in each adapter before using them. These submodules are pinned to immutable commits, do not run on CI merely by being declared and should not be upgraded silently. If the Git client did not fetch submodules, the adapters remain discoverable but the **full upstream library is not available**. Never claim it was loaded without reading the files.

The project-local packages (Obscura and any game-specific, 3Dviz, Spec Kit, CCGS or CodeGraph tools) are retained. Git submodules and skill descriptions alone do not install MCP servers, IDE plugins or build dependencies. Route tasks according to relevance; non-game projects are not obliged to use game-development guidance.

## Reconciled integration — 25 November 2026

The integrations from PRs #2–#5 share **one Git submodule per upstream**. The earlier paths under `.ai-tools/upstream/` are superseded by the two canonical paths above; do not initialize a second copy. GameDev uses revision `c6ca6c41c839b68319ffc08430b99ab768debc32` from PR #4, replacing the earlier router-only reference `19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9`. Its published tree contains all twelve adapted entry points, including the router. 3Dviz retains revision `d077e0e68915c25be8e71d74684d3144fd1c2aca`.

`gamedev-router` provides project-aware selection before the upstream `router`; `speckit-router` checks readiness and `speckit-workflow` guides work with the existing setup. These names are complementary entry points, not separate installations. Codex and Claude adapters resolve the same upstream resources.

Use the current task's authorizations and the repository's existing instructions. Request additional approval only for actions outside that authorization, including unapproved external charges. No submodule initialization, package installation, paid generation or rendering was performed as part of this reconciliation.
