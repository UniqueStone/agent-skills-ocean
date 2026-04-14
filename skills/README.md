# Skills Ocean

A collection of custom skills (slash commands) for Claude Code. Each skill lives in its own directory under `skills/` and is invoked via `/skill-name` in the Claude Code CLI.

## Available Skills

| Skill             | Command                              | Description                                                                     |
|-------------------|--------------------------------------|---------------------------------------------------------------------------------|
| Design with ASCII | `/design-with-ascii [type] [topic]`  | Requirement analysis, UI prototypes, UML, architecture, and DB design in ASCII  |

## Usage

Invoke any skill in Claude Code using its slash command:

```text
/design-with-ascii all e-commerce checkout system
/design-with-ascii prototype login and registration flow
```

## Skill Directory Structure

```text
skills/
├── README.md                          # This file
└── design-with-ascii/
    └── SKILL.md                       # Skill definition and instructions
```

Each skill is a folder containing a `SKILL.md` file that defines:

- **Activation** — how the skill is triggered and what arguments it accepts
- **Role & Behavior** — what persona or capability the skill assumes
- **Outputs** — templates and formats for the skill's deliverables
- **Process** — step-by-step workflow the skill follows
- **Guidelines** — rules and constraints for consistent output

## Adding a New Skill

1. Create a new directory under `skills/` with a descriptive name (kebab-case)
2. Add a `SKILL.md` file with the skill definition
3. Update the table in this README with the new skill
