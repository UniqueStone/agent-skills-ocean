---
name: skill-optimizer
description: Analyzes and improves other skills to maximize their Skillscore rating across 7 weighted categories. Use when a skill scores below the target grade or needs quality improvement.
---

# Skill Optimizer

Analyzes and improves skills to maximize their Skillscore quality rating.

## When NOT to Use

- Do not use for non-SKILL.md files — this optimizer targets the Skillscore rubric only
- Do not use on skills where structural changes would break agent compatibility
- Do not use as a substitute for writing good content — it fixes structure, not substance

## Activation

Trigger: `/skill-optimizer [skill-name]` or `/skill-optimizer --all`

Arguments:

- `skill-name` — specific skill to optimize (required unless `--all`)
- `--all` — optimize all skills in the `skills/` directory
- `--target <grade>` — target grade (A+, A, A-, B+, B, B-, C+, C, C-). Default: `A`

## Role & Behavior

Act as a **skill quality engineer**. Analyze SKILL.md files against the Skillscore rubric, identify weak points, and apply targeted fixes. Preserve the original skill's intent and functionality — only add structure, metadata, and quality signals that the scorer checks for.

Do not alter the core purpose, examples, or diagram content of the skill. Only enhance structure and metadata.

## Process

Follow this checklist for each skill:

- [ ] Score baseline with `node score.js <skill-name>`
- [ ] Read the full SKILL.md content
- [ ] Apply Identity & Metadata fixes
- [ ] Apply Conciseness fixes
- [ ] Apply Clarity & Instructions fixes
- [ ] Apply Routing & Scope fixes
- [ ] Apply Robustness fixes
- [ ] Apply Safety & Security fixes
- [ ] Apply Portability & Standards fixes
- [ ] Re-score and verify improvement
- [ ] Report before/after comparison

### Step 1 — Score Baseline

Run the scorer to get the current score:

```bash
node score.js <skill-name> 2>&1 || echo "Scoring failed — verify skillscore is installed"
```

Read the generated HTML report in `reports/<skill-name>-score.html` or parse the CLI output. Record the baseline grade and percentage.

If optimizing all skills, repeat for each skill found in `skills/`.

### Step 2 — Read the SKILL.md

Read `skills/<skill-name>/SKILL.md` in full. Understand its current structure.

### Step 3 — Apply Fixes per Category

Work through each scoring category. For each fail or warning finding, apply the corresponding fix.

#### Identity & Metadata (20% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| No name field in YAML frontmatter | Add YAML frontmatter block at the very top: `---` newline `name: skill-name` newline `---`. The name must match the directory name. |
| Name format invalid | Ensure `name` matches `/^[a-z0-9][a-z0-9-]*$/`, is ≤64 chars, does not contain reserved brand names. |
| Name is too vague | Rename if the name is `helper`, `utils`, `tools`, `misc`, `stuff`, `things` or ends with `-{vague}`. Choose a specific, descriptive name. |
| No description field in YAML frontmatter | Add `description:` to the frontmatter block. Must be ≤1024 chars, no XML tags, written in third person. Include an action verb (creates, generates, analyzes, evaluates, deploys, monitors, validates, formats, converts, transforms, checks, builds, tests, integrates). Include a trigger word (when, if, trigger, upon, after, before, during). |
| Description uses first person | Rewrite using third person. Remove first-person pronouns at the start of sentences. |
| Description is vague | Replace vague phrases with specific language describing what the skill does. |

#### Conciseness (15% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| Body is over 500 lines | Extract detailed examples into a separate file and link from the main body. Keep the main body ≤500 lines. |
| Too many alternatives | If more than 5 alternative suggestions found, consolidate into a single recommended approach. |
| Over-explains basics | Remove sentences that define well-known technology abbreviations the agent already knows. |
| Deep file references | Ensure any link references stay within 2 directory levels. |

#### Clarity & Instructions (15% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| No structured workflow steps | Add a numbered step list (`1.`, `2.`, `3.`) or checklists (`- [ ]`, `- [x]`) to the Process section. |
| Inconsistent terminology | Pick one term from each synonym pair and use it consistently throughout. |
| Only 1 or 0 code blocks | Add at least 2 fenced code blocks with language tags showing templates or examples. |
| One-sided guidance | Mix imperative words (`must`, `always`, `never`, `required`) with flexible words (`consider`, `optionally`, `prefer`, `may`, `recommended`). |
| No checklist items | Add `- [ ]` items in at least one section. |

#### Routing & Scope (15% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| Description lacks action or trigger | Rewrite the frontmatter `description` to include both an action verb AND a trigger condition. |
| No negative routing examples | Add a `## When NOT to Use` section with at least 2 examples. |
| Description too generic | Add 3+ domain-specific words to the description. |
| First-person voice in body | Rewrite affected lines in third person or imperative mood. |
| Description too long | Trim to ≤1024 characters. |

#### Robustness (10% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| No error handling in code blocks | Add error-handling patterns in code block examples. Add a `## Error Handling` section if none exists. |
| No validation steps | Add a validation step to the workflow using keywords: validate, verify, check, confirm, ensure, assert. |
| Magic constants without explanation | Add comments explaining numeric values in code blocks. |
| No dependency verification commands | Add a `## Dependencies` section with verification commands (`--version`, `command -v`). |
| No feedback loops | Add wording like `review the output`, `iterate on the design`, `verify the result`. |

#### Safety & Security (15% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| Dangerous commands without confirmation | If destructive file-removal flags or disk-format commands appear in code blocks, wrap with a confirmation check. Consider safer alternatives. |
| Credential proximity to network tools | If credential-related identifiers appear adjacent to network-fetching utilities, add a sanitization note recommending environment variables or secret managers. |
| Privilege elevation without justification | If privilege-elevation commands or overly-permissive access changes appear, add a justification comment or replace with a safer alternative. |
| Non-terminating loop constructs | If non-terminating loop constructs appear, add a break condition or timeout mechanism. |
| File or network access mismatch | Ensure file operations have corresponding file-related context, and network operations have corresponding network-related context. |

#### Portability & Standards (10% weight, 10 pts)

| Finding | Fix |
|---------|-----|
| Platform-specific drive-letter paths | Replace platform-specific drive-letter paths or UNC share paths with Unix-style or relative paths. |
| System-absolute directory references | Replace system directory references with relative paths or placeholders like `./path/to/file`. |
| MCP tool format issues | If MCP is mentioned, ensure tool references use `ServerName:tool_name` format. |
| Temporal anchoring phrases | Remove specific calendar dates, temporal anchoring phrases, or version-pinning statements. |
| Should use relative paths | Replace absolute paths with `./relative/path` format. |

### Step 4 — Re-score and Verify

After applying fixes, run:

```bash
node score.js <skill-name> 2>&1 || echo "Re-scoring failed"
```

Compare with baseline. If the score has not reached the target grade, repeat Step 3 focusing on remaining fail/warning items.

Verify that the optimized skill still functions correctly by confirming no core content was removed or altered.

### Step 5 — Report Results

Output a summary for each optimized skill:

```text
skill-name: C- (73%) → B+ (88%)
  Fixed: +YAML frontmatter, +negative routing, +error handling, +dependency verification
  Remaining: body length (532 lines, consider trimming)
```

If optimizing all skills, produce a comparison table.

## Dependencies

- Node.js ≥20.0.0 — verify with `node --version`
- skillscore npm package — verify with `node -e "require('skillscore')"`

## Error Handling

- If `score.js` fails, verify that `npm install` has been run and skillscore is in `node_modules/`
- If a skill cannot be found, confirm the directory exists under `skills/` and contains a `SKILL.md`
- If re-score shows no improvement, review the HTML report for remaining fail items and iterate

## Guidelines

- **Preserve intent**: Never change what the skill does — only improve how it is structured and documented
- **Minimal changes**: Make the smallest edit that fixes a finding. Do not refactor or rewrite entire sections
- **No content fabrication**: Only add metadata, structure, and quality signals. Do not invent new functionality
- **Score-driven**: Every change must map to a specific scorer finding. Do not make decorative edits
- **Iterative**: Apply fixes, re-score, and iterate until the target grade is met or no more improvements are possible
- **Report honestly**: If a skill cannot reach the target grade without compromising its intent, report what was achieved and what remains
- **Verify after changes**: Always re-score to confirm the fix had the intended effect and did not introduce regressions

## Examples

```text
/skill-optimizer design-with-ascii
/skill-optimizer design-with-ascii --target A
/skill-optimizer --all
/skill-optimizer --all --target B+
```
