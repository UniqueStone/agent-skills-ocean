# Skills Ocean

A universal collection of AI coding agent skills — **write once, deploy everywhere**.

Define skills in a universal format, then install them to your favorite AI coding tools with a single command.

## Supported Agents

| `--agent` Value | Agent | Install Target | Format | Type |
|---|---|---|---|---|
| `claude-code` | Claude Code | `.claude/skills/` | SKILL.md | Native |
| `cursor` | Cursor | `.cursor/rules/` | .mdc | MDC |
| `windsurf` | Windsurf | `.windsurf/rules/` | .mdc | MDC |
| `copilot` | GitHub Copilot | `.github/` | copilot-instructions.md | Injection |
| `cline` | Cline | `.clinerules/` | .md | Direct copy |
| `codex` | OpenAI Codex | `./` | AGENTS.md | Injection |
| `gemini` | Gemini CLI | `./` | GEMINI.md | Injection |
| `opencode` | OpenCode | `.opencode/skills/` | SKILL.md | Native |
| `kilo` | Kilo Code | `.kilo/skills/` | SKILL.md | Native |
| `openspec` | OpenSpec | `openspec/` | AGENTS.md | Injection |

> **10 agents supported!** Native agents (Claude Code, OpenCode, Kilo Code) use the Agent Skills open specification `SKILL.md` format directly — zero conversion overhead.

## Quick Start

### 1. Clone this repository

```bash
git clone https://github.com/UniqueStone/agent-skills-ocean.git
cd agent-skills-ocean
```

### 2. Install skills to your project

Both a **Node.js** and a **Bash** installer are provided — use whichever suits your environment:

```bash
# Node.js version (cross-platform)
node install.js --target /path/to/your/project

# Bash version (macOS, Linux, WSL, Git Bash)
./install.sh --target /path/to/your/project

# Install for specific agents
node install.js --agent cursor,windsurf --target /path/to/your/project

# Install for all native SKILL.md agents
node install.js --agent claude-code,opencode,kilo --target /path/to/your/project

# Install a single skill
node install.js --agent cursor --skill design-with-ascii

# Preview without making changes
node install.js --dry-run
./install.sh --dry-run
```

### 3. Use the skills in your agent

| Agent | How to invoke |
|---|---|
| Claude Code | Skills auto-discovered in `.claude/skills/`; agent loads on demand |
| Cursor | Reference `@skill-name` in chat |
| Windsurf | Reference the rule in chat |
| GitHub Copilot | Skills included in context automatically |
| Cline | Mention the skill in your prompt |
| OpenAI Codex | Skills included in AGENTS.md context |
| Gemini CLI | Skills included in GEMINI.md context |
| OpenCode | Skills auto-discovered in `.opencode/skills/`; use `skill` tool |
| Kilo Code | Skills auto-discovered in `.kilo/skills/`; agent loads on demand |
| OpenSpec | Skills included in `openspec/AGENTS.md` context |

## Install Script Reference

Both `install.js` and `install.sh` share the same interface:

```text
node install.js [options]
./install.sh [options]

Options:
  --agent <names>    Target agent(s), comma-separated
                     Choices: claude-code, cursor, windsurf, copilot, cline,
                              codex, gemini, opencode, kilo, openspec
                     Default: all agents

  --target <path>    Target project directory (default: .)
  --skill <name>     Install a specific skill (default: all)
  --list             List available skills and supported agents
  --force            Overwrite existing files
  --dry-run          Preview changes without writing
  --uninstall        Remove installed skills instead
  -h, --help         Show this help
```

### Examples

```bash
node install.js                                        # All skills, all agents
./install.sh --agent cursor,windsurf                   # All skills, specific agents
node install.js --agent claude-code,opencode,kilo      # Native SKILL.md agents only
./install.sh --skill design-with-ascii                 # One skill, all agents
node install.js --target ~/projects/my-app             # Install to another project
./install.sh --agent cursor --force                    # Force reinstall
node install.js --uninstall --agent copilot            # Remove skills from Copilot
./install.sh --list                                    # List skills and agents
```

## Available Skills

| Skill | Description |
|---|---|
| Design with ASCII | Requirement analysis, UI prototypes, UML, architecture, and DB design in ASCII |
| Resume Optimizer | Reviews and optimizes IT resumes with 10-dimension scoring |
| Skill Optimizer | Analyzes and improves other skills to maximize their Skillscore quality rating |

## Creating a New Skill

1. Create `skills/{kebab-case-name}/SKILL.md` with these sections:

   - **Activation** — trigger syntax, accepted arguments, defaults
   - **Role & Behavior** — persona or capability the skill assumes
   - **Outputs** — templates and formats for deliverables
   - **Process** — step-by-step workflow to follow
   - **Guidelines** — rules and constraints for consistent output
   - **Examples** — concrete invocation examples

2. Update the skills table in this README
3. Run `node install.js --list` (or `./install.sh --list`) to verify the new skill is discovered
4. A quality score report is generated automatically in `reports/` when installing

## Skill Quality Scoring

Skills are automatically evaluated using [Skillscore](https://github.com/joeynyc/skillscore) when installed. Scores are based on 7 weighted categories:

| Category | Weight | Criteria |
|---|---|---|
| Identity & Metadata | 20% | YAML frontmatter, valid name/description format |
| Conciseness | 15% | Body under 500 lines, progressive disclosure |
| Clarity & Instructions | 15% | Workflow steps, consistent terminology, code examples |
| Routing & Scope | 15% | Clear WHAT+WHEN, negative routing, domain vocabulary |
| Robustness | 10% | Error handling, validation steps, dependency checks |
| Safety & Security | 15% | No destructive commands, no secret exfiltration risks |
| Portability & Standards | 10% | Cross-platform paths, MCP format compliance |

### Scoring Commands

```bash
# Score all skills
node score.js --all

# Score a single skill
node score.js design-with-ascii

# Custom output path
node score.js design-with-ascii --output ./my-report.html

# Skip scoring during install
node install.js --skip-score

# Score only, no installation
node install.js --score-only
```

HTML reports are generated in the `reports/` directory.

## How It Works

Each skill is defined as a `SKILL.md` file following the [Agent Skills open specification](https://agentskills.io/). The install script converts each skill to the appropriate format for each AI agent:

- **Native agents** (Claude Code, OpenCode, Kilo Code) — skills are copied directly to the agent's native `skills/` directory, maintaining the `SKILL.md` format with zero conversion
- **MDC-format agents** (Cursor, Windsurf) — each skill becomes a separate `.mdc` rule file with YAML frontmatter wrapper
- **File-based agents** (Cline) — each skill becomes a separate `.md` file in the agent's rules directory
- **Single-file agents** (Copilot, Codex, Gemini, OpenSpec) — skills are injected into the agent's instruction file with HTML comment markers for safe updates and removal

## Repository Structure

```text
agent-skills-ocean/
├── install.js                          # Universal installer (Node.js)
├── install.sh                          # Universal installer (Bash)
├── score.js                            # Skill quality scoring with HTML reports
├── package.json                        # Dependencies (skillscore)
├── CLAUDE.md                           # Project instructions for Claude Code
├── README.md                           # This file
├── skills/
│   ├── README.md                       # Skills index
│   └── {skill-name}/
│       └── SKILL.md                    # Skill definition (Agent Skills spec)
└── reports/                            # Generated score reports (gitignored)
```

## License

MIT
