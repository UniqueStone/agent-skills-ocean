<!-- skills-ocean:start:github-copilot-instructions -->

# GitHub Copilot Instructions — Skills Ocean

This repository contains a universal skills collection for AI coding agents. When working on this codebase, use these guidelines to maintain consistency and quality.

## Project Purpose

Skills Ocean is a cross-platform skills repository that lets AI agents define capabilities once (`SKILL.md`) and install them to any platform:

- **Claude Code** (native)
- **Cursor, Windsurf, Cline** (file-based rules)
- **GitHub Copilot, OpenAI Codex, Gemini** (injected into single files)

## Before Starting Work

1. Review [README.md](../README.md) for installation and usage patterns
2. Read [AGENTS.md](../AGENTS.md) for agent development guidelines
3. Examine [skills/design-with-ascii/SKILL.md](../skills/design-with-ascii/SKILL.md) as a reference implementation
4. Check [skills/README.md](../skills/README.md) for skill creation standards

## Key Principles

### Skill Definitions Must Include

- ✅ All 6 required sections: Activation, Role & Behavior, Design Outputs, Process, Guidelines, Examples
- ✅ Examples showing invocation across multiple agents
- ✅ ASCII diagrams for visual design skills (not Mermaid)
- ✅ Language tags on all code blocks (markdown, javascript, bash, sql, etc.)

### Installer Compatibility

- The `install.js` and `install.sh` scripts are the source of truth
- Test changes with: `node install.js --dry-run` and `node install.js --list`
- Verify Markdown syntax: MD040 (fenced-code-language), MD060 (table-column-style), MD032 (blanks-around-lists)

### Universal Format Requirements

- No agent-specific APIs or syntax
- ASCII art for diagrams (renders better across all platforms)
- Clear, portable examples
- Self-contained SKILL.md files (no external dependencies)

## Common Tasks

### Adding a New Skill

1. Create `skills/{name}/SKILL.md` with all 6 required sections
2. Update tables in [skills/README.md](../skills/README.md) and [README.md](../README.md)
3. Test: `node install.js --list` and `node install.js --dry-run`
4. Verify with: `node install.js --agent copilot --target /tmp/test`

### Updating an Existing Skill

1. Edit the `SKILL.md` file directly
2. Preserve all 6 sections
3. Test installation: `node install.js --skill {name} --force --dry-run`

### Testing Installation

```bash
# Preview all changes
node install.js --dry-run

# Install all skills
node install.js

# Install specific skill to specific agent
node install.js --agent copilot --skill design-with-ascii

# List available skills
node install.js --list
```

## Skill Reference

| Skill                                                     | Use Case                                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| [design-with-ascii](../skills/design-with-ascii/SKILL.md) | Requirement analysis, prototypes, UML, architecture, database design |

## Contributing a New Skill

1. **Choose a kebab-case name** for your skill domain (e.g., `api-design`, `security-audit`)
2. **Create the file** at `skills/{name}/SKILL.md`
3. **Include all 6 sections** (Activation, Role & Behavior, Design Outputs, Process, Guidelines, Examples)
4. **Use ASCII art** for visual designs
5. **Add examples** for multiple agents (Claude Code + Cursor minimum)
6. **Test thoroughly** before submitting

See [skills/README.md](../skills/README.md) for detailed guidance.

## File Structure Reference

```
skills-ocean/
├── .github/
│   └── copilot-instructions.md    ← You are here
├── AGENTS.md                       # Agent development guide
├── CLAUDE.md                       # Claude Code instructions
├── install.js / install.sh         # Installers
├── README.md                       # User guide
└── skills/
    ├── README.md                   # Skill creation guide
    └── design-with-ascii/
        └── SKILL.md                # Reference implementation
```

## Quick Reference

- **Add skill**: `skills/{name}/SKILL.md` (6 required sections)
- **Test installer**: `node install.js --dry-run`
- **List skills**: `node install.js --list`
- **Verify syntax**: Check Markdown linting (MD040, MD060, MD032)
- **Reference**: [design-with-ascii/SKILL.md](../skills/design-with-ascii/SKILL.md)

<!-- skills-ocean:end:github-copilot-instructions -->
