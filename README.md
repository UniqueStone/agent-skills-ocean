# Skills Ocean

A collection of custom skills (slash commands) for [Claude Code](https://claude.ai/code). Each skill extends Claude Code with specialized capabilities — invoked via `/skill-name` in the CLI.

## Available Skills

| Skill             | Command                              | Description                                                                     |
|-------------------|--------------------------------------|---------------------------------------------------------------------------------|
| Design with ASCII | `/design-with-ascii [type] [topic]`  | Requirement analysis, UI prototypes, UML, architecture, and DB design in ASCII  |

## Quick Start

1. Clone this repository
2. Open it in Claude Code
3. Invoke a skill using its slash command:

```text
/design-with-ascii all e-commerce checkout system
/design-with-ascii prototype login and registration flow
/design-with-ascii uml order processing module
/design-with-ascii architecture microservices for a blog platform
/design-with-ascii database multi-tenant SaaS application
/design-with-ascii requirement task management tool
```

## How Skills Work

Each skill is a self-contained directory under `skills/` with a single `SKILL.md` that defines its activation, behavior, outputs, and process.

```text
skills/
├── README.md                  # Skills index
└── {skill-name}/
    └── SKILL.md               # Skill definition
```

A `SKILL.md` includes:

- **Activation** — trigger syntax and accepted arguments
- **Role & Behavior** — persona the skill assumes when active
- **Outputs** — templates and formats for deliverables
- **Process** — step-by-step workflow to follow
- **Guidelines** — rules and constraints for consistent output
- **Examples** — concrete invocation examples

## Adding a New Skill

1. Create `skills/{kebab-case-name}/SKILL.md` following the convention above
2. Update the skills table in `skills/README.md`
3. Keep `SKILL.md` self-contained — no external file dependencies

## License

MIT
