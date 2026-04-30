# AI Agent Instructions — Skills Ocean

This is a repository of reusable skills for AI coding agents. Skills are written once in a universal format and installed to any agent platform with a single command.

## Quick Overview

- **Purpose**: Write agent skills once, install everywhere
- **Language**: JavaScript/Node.js + Bash (installers and examples)
- **Main deliverable**: `skills/{name}/SKILL.md` files
- **Installation**: `node install.js` or `./install.sh`
- **Specification**: [Agent Skills open spec](https://agentskills.io/)

## Repository Structure

```
agent-skills-ocean/
├── CLAUDE.md                    # Instructions for Claude Code
├── AGENTS.md                    # This file — agent development guide
├── install.js / install.sh      # Universal skill installer (Node.js + Bash)
├── score.js                     # Skill quality scoring with HTML reports
├── README.md                    # User-facing quick start
├── skills/
│   ├── README.md                # Skills index & creation guide
│   └── {skill-name}/
│       └── SKILL.md             # Universal skill definition
└── reports/                     # Generated score reports (gitignored)
```

## Skill Definition Convention

Every skill is a `SKILL.md` file in `skills/{kebab-case-name}/` with these required sections:

| Section             | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| **Activation**      | Trigger syntax, accepted arguments, defaults                        |
| **Role & Behavior** | Persona/capability the agent assumes                                |
| **Design Outputs**  | Templates and formats for deliverables (use ASCII art, code blocks) |
| **Process**         | Step-by-step workflow to follow                                     |
| **Guidelines**      | Constraints, best practices, output style                           |
| **Examples**        | Concrete invocation examples for different agents                   |

See [skills/README.md](skills/README.md) for detailed guidance on creating new skills.

## Agent Target Formats

When a skill is installed, the installer converts it to the agent's native format:

### Native Agents (SKILL.md — zero conversion)

| Agent | Output Location | Notes |
|---|---|---|
| Claude Code | `.claude/skills/{name}/SKILL.md` | Direct copy |
| OpenCode | `.opencode/skills/{name}/SKILL.md` | Direct copy |
| Kilo Code | `.kilo/skills/{name}/SKILL.md` | Direct copy |

All three agents follow the [Agent Skills open specification](https://agentskills.io/) — `SKILL.md` with YAML frontmatter (`name`, `description`). The installer copies files directly with no format conversion.

### MDC-format Agents

| Agent | Output Location | Conversion |
|---|---|---|
| Cursor | `.cursor/rules/{name}.mdc` | Wrapped in MDC frontmatter |
| Windsurf | `.windsurf/rules/{name}.mdc` | Wrapped in MDC frontmatter |

MDC format wraps the skill content in a YAML frontmatter block:
```yaml
---
description: Skill description from SKILL.md
alwaysApply: false
---

{SKILL.md content}
```

### File-based Agents (direct copy)

| Agent | Output Location | Conversion |
|---|---|---|
| Cline | `.clinerules/{name}.md` | Direct copy |

### Injection-based Agents (single instruction file)

| Agent | Output Location | Method |
|---|---|---|
| GitHub Copilot | `.github/copilot-instructions.md` | Injected with markers |
| OpenAI Codex | `AGENTS.md` | Injected with markers |
| Gemini CLI | `GEMINI.md` | Injected with markers |
| OpenSpec | `openspec/AGENTS.md` | Injected with markers |

**Markers used for injection:** `<!-- skills-ocean:start:{name} -->` and `<!-- skills-ocean:end:{name} -->`

Injection allows multiple skills to coexist in a single file, with each skill safely updatable or removable without affecting others.

## Key File Purposes

| File | Purpose |
|---|---|
| [install.js](install.js) | Node.js installer — discovers skills, converts to agent formats |
| [install.sh](install.sh) | Bash installer — same functionality, cross-platform |
| [score.js](score.js) | Evaluates skills using Skillscore, generates HTML reports |
| [SKILL.md](skills/design-with-ascii/SKILL.md) | Example skill: visual design in ASCII |

## Common Development Tasks

### Add a New Skill

1. Create `skills/{name}/SKILL.md` with all 6 required sections
2. Add an entry to [skills/README.md](skills/README.md)
3. Update the skills table in [README.md](README.md)
4. Test with `node install.js --list` and `node install.js --dry-run`

### Add Support for a New Agent

1. Add a new entry to the `agents` object in `install.js`
2. Add a new `case` block in `install_agent()` in `install.sh`
3. Add the agent key to `ALL_AGENTS` in both files
4. Update the agent tables in [README.md](README.md) and this file
5. Test with `node install.js --agent <new-agent> --dry-run`

### Test the Installer

```bash
# List available skills and agents
node install.js --list

# Preview changes without writing
node install.js --dry-run

# Install to a test project
node install.js --target /path/to/test/project

# Install specific agents
node install.js --agent claude-code,opencode,kilo --target /path/to/test/project

# Reinstall with force
node install.js --agent cursor --force --target /path/to/test/project

# Uninstall
node install.js --uninstall --target /path/to/test/project
```

## Skill Guidelines for Agent Developers

### Writing Skills for Universal Compatibility

1. **Use portable syntax**: Avoid agent-specific APIs or features
2. **ASCII diagrams**: Prefer ASCII art over Mermaid or other diagram languages (better cross-platform rendering)
3. **Code blocks**: Always specify language (`markdown`, `javascript`, `bash`, `sql`, etc.)
4. **Examples section**: Show how to invoke in at least 2 agents (e.g., Claude Code + Cursor)
5. **Process clarity**: Use numbered steps; avoid ambiguity in workflows
6. **Frontmatter**: Include `name` (matching directory name) and `description` (≤1024 chars)

### Best Practices

- **Persona matters**: Clearly define what role the agent should adopt (e.g., "Act as a DevOps Engineer")
- **Output templates**: Provide concrete examples, not just descriptions
- **Constraints**: Specify length limits, style requirements, error handling
- **Test coverage**: When possible, include edge cases or error scenarios in examples

## Quick Commands

```bash
# Install all skills to current project
node install.js

# Install specific skill to specific agents
node install.js --skill design-with-ascii --agent cursor,windsurf

# Install native SKILL.md agents only
node install.js --agent claude-code,opencode,kilo

# Preview changes
node install.js --dry-run

# List all available skills
node install.js --list
```

## Related Documentation

- [Skill Creation Guide](skills/README.md) — detailed steps for adding new skills
- [Design with ASCII Skill](skills/design-with-ascii/SKILL.md) — working example
- [Installation Guide](README.md) — for end users installing skills to their projects
- [CLAUDE.md](CLAUDE.md) — instructions for Claude Code specifically
- [Agent Skills Specification](https://agentskills.io/) — open standard for SKILL.md format
