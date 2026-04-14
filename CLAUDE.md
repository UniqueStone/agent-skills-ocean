# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **custom skills collection for Claude Code** — a repository of slash commands that extend Claude Code's capabilities. Each skill is a self-contained directory with a `SKILL.md` defining its activation, behavior, outputs, and process.

Skills are invoked in Claude Code via `/skill-name`. Example: `/design-with-ascii all e-commerce checkout system`.

## Repository Structure

```text
skills/
├── README.md                  # Skills index and usage guide
└── {skill-name}/
    └── SKILL.md               # Skill definition (the only required file per skill)
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
2. Update the skills table in `skills/README.md`
3. Keep SKILL.md self-contained — no external file dependencies

## Linting

Markdown linting rules are enforced (MD040 fenced-code-language, MD060 table-column-style, MD032 blanks-around-lists). All fenced code blocks must specify a language. Tables must have aligned columns.
