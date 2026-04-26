# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **universal AI coding agent skills collection** — a repository of skills that can be installed into any AI coding tool: Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, OpenAI Codex, Gemini CLI, and more.

Skills are defined in a universal format (`SKILL.md`) and converted to each agent's native format by the install script (`install.js`).

## Repository Structure

```text
skills-ocean/
├── install.js                          # Universal installer script
├── score.js                            # Skill quality scoring + HTML reports
├── CLAUDE.md                           # This file
├── README.md                           # Project documentation
├── skills/
│   ├── README.md                       # Skills index
│   └── {skill-name}/
│       └── SKILL.md                    # Skill definition
└── reports/                            # Generated score reports (gitignored)
```

## Skill Definition Convention

Every skill lives in `skills/{kebab-case-name}/SKILL.md` and must include these sections:

- **Activation** — trigger syntax, accepted arguments, defaults
- **Role & Behavior** — persona or capability the skill assumes when active
- **Design Outputs** — templates and formats for deliverables
- **Process** — step-by-step workflow to follow
- **Guidelines** — rules and constraints for consistent output
- **Examples** — concrete invocation examples

## When Adding a New Skill

1. Create `skills/{name}/SKILL.md` following the convention above
2. Update the skills table in `README.md` and `skills/README.md`
3. Keep SKILL.md self-contained — no external file dependencies
4. Run `node install.js --list` to verify the skill is discovered
5. Run `node score.js <skill-name>` to generate a quality score report (HTML)

## Supported Agent Targets

The install script (`install.js`) converts skills to each agent's native format:

| Agent          | Output Location                    | Format    |
|----------------|------------------------------------|-----------|
| Claude Code    | `skills/{name}/SKILL.md`           | Direct    |
| Cursor         | `.cursor/rules/{name}.mdc`         | MDC       |
| Windsurf       | `.windsurf/rules/{name}.mdc`       | MDC       |
| GitHub Copilot | `.github/copilot-instructions.md`  | Injected  |
| Cline          | `.clinerules/{name}.md`            | Direct    |
| OpenAI Codex   | `AGENTS.md`                        | Injected  |
| Gemini CLI     | `GEMINI.md`                        | Injected  |

## Linting

Markdown linting rules are enforced (MD040 fenced-code-language, MD060 table-column-style, MD032 blanks-around-lists). All fenced code blocks must specify a language. Tables must have aligned columns.
