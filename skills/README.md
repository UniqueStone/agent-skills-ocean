# Skills Ocean

A universal collection of skills for AI coding agents. Each skill lives in its own directory under `skills/` and can be installed to Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, OpenAI Codex, Gemini CLI, and more via the install script.

## Available Skills

| Skill             | Command                              | Description                                                                     |
|-------------------|--------------------------------------|---------------------------------------------------------------------------------|
| Design with ASCII | `/design-with-ascii [type] [topic]`  | Requirement analysis, UI prototypes, UML, architecture, and DB design in ASCII  |

## Usage

Invoke any skill in your AI agent using its command syntax. For Claude Code:

```text
/design-with-ascii all e-commerce checkout system
/design-with-ascii prototype login and registration flow
```

For other agents, install skills first:

```bash
node install.js --target /path/to/your/project
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
3. Update the table in this README and the root `README.md` with the new skill
4. Run `node install.js --list` to verify the new skill is discovered
