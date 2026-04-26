# AI Agent Instructions — Skills Ocean

This is a repository of reusable skills for AI coding agents. Skills are written once in a universal format and installed to any agent platform (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, OpenAI Codex, Gemini CLI) with a single command.

## Quick Overview

- **Purpose**: Write agent skills once, install everywhere
- **Language**: JavaScript/Node.js + Bash (installers and examples)
- **Main deliverable**: `skills/{name}/SKILL.md` files
- **Installation**: `node install.js` or `./install.sh`
- **Active development**: GitHub Copilot, Cursor, Windsurf team adoption

## Repository Structure

```
skills-ocean/
├── CLAUDE.md                    # Instructions for Claude Code
├── AGENTS.md                    # This file — agent development guide
├── install.js / install.sh      # Universal skill installer (Node.js + Bash)
├── README.md                    # User-facing quick start
├── skills/
│   ├── README.md                # Skills index & creation guide
│   └── {skill-name}/
│       └── SKILL.md             # Universal skill definition
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

## Key File Purposes

| File                                          | Purpose                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| [install.js](install.js)                      | Node.js installer — discovers skills, converts to agent formats            |
| [install.sh](install.sh)                      | Bash installer — same functionality, cross-platform                        |
| [SKILL.md](skills/design-with-ascii/SKILL.md) | Example skill: visual design (requirements, prototypes, UML, architecture) |
| [README.md](README.md)                        | Installation & usage guide for end users                                   |

## Common Development Tasks

### Add a New Skill

1. Create `skills/{name}/SKILL.md` with all 6 required sections
2. Add an entry to [skills/README.md](skills/README.md)
3. Update the skills table in [README.md](README.md)
4. Test with `node install.js --list` and `node install.js --dry-run`

### Test the Installer

```bash
# List available skills and agents
node install.js --list

# Preview changes without writing
node install.js --dry-run

# Install to a test project
node install.js --target /path/to/test/project

# Reinstall with force
node install.js --agent cursor --force --target /path/to/test/project

# Uninstall
node install.js --uninstall --target /path/to/test/project
```

### Verify Skill Syntax

- All fenced code blocks must specify a language (MD040)
- Tables must have aligned columns (MD060)
- No excessive blank lines between list items (MD032)
- Run `npm run lint` if available

## Agent Target Formats

When a skill is installed, the installer converts it to the agent's native format:

| Agent          | Output Location                   | Format                | Installation |
| -------------- | --------------------------------- | --------------------- | ------------ |
| Claude Code    | `skills/{name}/SKILL.md`          | Direct copy           | Native       |
| Cursor         | `.cursor/rules/{name}.mdc`        | MDC wrapper           | File-based   |
| Windsurf       | `.windsurf/rules/{name}.mdc`      | MDC wrapper           | File-based   |
| GitHub Copilot | `.github/copilot-instructions.md` | Injected with markers | Single file  |
| Cline          | `.clinerules/{name}.md`           | Direct copy           | File-based   |
| OpenAI Codex   | `AGENTS.md`                       | Injected with markers | Single file  |
| Gemini CLI     | `GEMINI.md`                       | Injected with markers | Single file  |

**Markers used for injection:** `<!-- skills-ocean:start:{name} -->` and `<!-- skills-ocean:end:{name} -->`

## Skill Guidelines for Agent Developers

### Writing Skills for Universal Compatibility

1. **Use portable syntax**: Avoid agent-specific APIs or features
2. **ASCII diagrams**: Prefer ASCII art over Mermaid or other diagram languages (better cross-platform rendering)
3. **Code blocks**: Always specify language (`markdown`, `javascript`, `bash`, `sql`, etc.)
4. **Examples section**: Show how to invoke in at least 2 agents (e.g., Claude Code + Cursor)
5. **Process clarity**: Use numbered steps; avoid ambiguity in workflows

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
