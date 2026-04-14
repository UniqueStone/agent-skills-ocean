# Skills Ocean

A universal collection of AI coding agent skills — **write once, deploy everywhere**.

Define skills in a universal format, then install them to your favorite AI coding tools with a single command.

## Supported Agents

| Agent            | Install Target                  | Format                  |
|------------------|---------------------------------|-------------------------|
| Claude Code      | `skills/`                       | SKILL.md                |
| Cursor           | `.cursor/rules/`                | .mdc                    |
| Windsurf         | `.windsurf/rules/`              | .mdc                    |
| GitHub Copilot   | `.github/`                      | copilot-instructions.md |
| Cline            | `.clinerules/`                  | .md                     |
| OpenAI Codex     | `./`                            | AGENTS.md               |
| Gemini CLI       | `./`                            | GEMINI.md               |

## Quick Start

### 1. Clone this repository

```bash
git clone https://github.com/your-username/skills-ocean.git
cd skills-ocean
```

### 2. Install skills to your project

```bash
# Install all skills for all supported agents
node install.js --target /path/to/your/project

# Install for specific agents
node install.js --agent cursor,windsurf --target /path/to/your/project

# Install a single skill
node install.js --agent cursor --skill design-with-ascii

# Preview without making changes
node install.js --dry-run
```

### 3. Use the skills in your agent

| Agent            | How to invoke                                           |
|------------------|---------------------------------------------------------|
| Claude Code      | `/skill-name` in the CLI                                |
| Cursor           | Reference `@skill-name` in chat                         |
| Windsurf         | Reference the rule in chat                              |
| GitHub Copilot   | Skills are included in context automatically            |
| Cline            | Mention the skill in your prompt                        |
| OpenAI Codex     | Skills are included in AGENTS.md context                |
| Gemini CLI       | Skills are included in GEMINI.md context                |

## Install Script Reference

```text
node install.js [options]

Options:
  --agent <names>    Target agent(s), comma-separated
                     Choices: claude-code, cursor, windsurf, copilot, cline, codex, gemini
                     Default: all agents

  --target <path>    Target project directory (default: .)
  --skill <name>     Install a specific skill (default: all)
  --list             List available skills and supported agents
  --force            Overwrite existing files
  --dry-run          Preview changes without writing
  --uninstall        Remove installed skills instead
  -h, --help         Show help
```

### Examples

```bash
node install.js                                    # All skills, all agents
node install.js --agent cursor,windsurf            # All skills, specific agents
node install.js --skill design-with-ascii          # One skill, all agents
node install.js --target ~/projects/my-app         # Install to another project
node install.js --agent cursor --force             # Force reinstall
node install.js --uninstall --agent copilot        # Remove skills from Copilot
node install.js --list                             # List skills and agents
```

## Available Skills

| Skill             | Description                                                                     |
|-------------------|---------------------------------------------------------------------------------|
| Design with ASCII | Requirement analysis, UI prototypes, UML, architecture, and DB design in ASCII  |

## Creating a New Skill

1. Create `skills/{kebab-case-name}/SKILL.md` with these sections:

   - **Activation** — trigger syntax, accepted arguments, defaults
   - **Role & Behavior** — persona or capability the skill assumes
   - **Outputs** — templates and formats for deliverables
   - **Process** — step-by-step workflow to follow
   - **Guidelines** — rules and constraints for consistent output
   - **Examples** — concrete invocation examples

2. Update the skills table in this README
3. Run `node install.js --list` to verify the new skill is discovered

## How It Works

Each skill is defined as a `SKILL.md` file in a universal format. The install script converts each skill to the appropriate format for each AI agent:

- **File-based agents** (Cursor, Windsurf, Cline) — each skill becomes a separate rule file in the agent's rules directory
- **Single-file agents** (Copilot, Codex, Gemini) — skills are injected into the agent's instruction file with comment markers for safe updates
- **Native agents** (Claude Code) — skills are copied directly to the project's `skills/` directory

## Repository Structure

```text
skills-ocean/
├── install.js                          # Universal installer script
├── CLAUDE.md                           # Project instructions for Claude Code
├── README.md                           # This file
├── skills/
│   ├── README.md                       # Skills index
│   └── {skill-name}/
│       └── SKILL.md                    # Skill definition
```

## License

MIT
