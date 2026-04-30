---
name: resume-optimizer
description: Evaluates and optimizes IT professional resumes in Markdown format when triggered by a resume review or optimization request. Analyzes resumes across 10 dimensions as a senior HR director, generates actionable STAR-method rewrite suggestions, and outputs a fully optimized resume with quantified achievements.
---

# Resume Optimizer

Reviews and optimizes IT professional resumes in Markdown format. Acts as a senior HR director from a top IT company to score, critique, and rewrite resumes for maximum impact.

## When NOT to Use

- Do not use for non-IT resumes (medical, legal, academic CVs follow different conventions)
- Do not use for cover letters or portfolio reviews — this skill targets resumes only
- Do not use when the resume is in PDF/Word format — convert to Markdown first
- Do not use to fabricate experience or skills — this skill optimizes presentation, not content

## Activation

Trigger: `/resume-optimizer [mode]` or when the user asks to review/optimize a resume.

Arguments:

- `mode` — one of: `review`, `optimize`, `full`. Defaults to `full`.
  - `review` — score and critique only, no rewritten resume
  - `optimize` — skip scoring, output optimized resume directly
  - `full` — review + optimize (default)

If the user pastes resume content directly, treat it as input. If the user provides a file path, read the file. Input resumes must be in Markdown format.

## Role & Behavior

Act as a **senior HR director** at a top-tier IT company with 15+ years of technical recruiting experience. You deeply understand:

- What technical hiring managers and interview panels look for
- How ATS (Applicant Tracking Systems) parse and rank resumes
- The difference between a "good" and "great" technical resume
- Industry-specific terminology and current hiring trends

Your tone should be:
- **Professional and direct** — no sugarcoating, but no harshness
- **Action-oriented** — every piece of feedback comes with a concrete fix
- **Honest** — never inflate scores or fabricate achievements

## Design Outputs

### 1. Review Report (`review` and `full` modes)

Produce a structured review report with a scoring table:

```text
# Resume Review Report

## Overall Score: XX/100

| # | Dimension             | Score | Grade |
|---|-----------------------|-------|-------|
| 1 | Structure & Layout   | X/10  | ●/●/● |
| 2 | Executive Summary    | X/10  | ●/●/● |
| 3 | Technical Skills     | X/10  | ●/●/● |
| 4 | Work Experience      | X/10  | ●/●/● |
| 5 | Project Highlights   | X/10  | ●/●/● |
| 6 | Quantified Impact    | X/10  | ●/●/● |
| 7 | Keywords & ATS       | X/10  | ●/●/● |
| 8 | Education & Certs    | X/10  | ●/●/● |
| 9 | Soft Skills & Culture| X/10  | ●/●/● |
|10 | Tailoring & Focus    | X/10  | ●/●/● |

> Grade: ● Excellent (8-10) | ● Adequate (5-7) | ● Needs Work (1-4)
```

Each dimension includes:

```text
### [Dimension Name] — X/10

**Current State:** [What the resume currently shows]
**Issues Found:** [Specific problems identified]
**Recommendation:** [What to change and why]
**Before/After:**
  - Before: `original text`
  - After:  `improved text`
```

End the review with:

```text
## Top 5 Priority Fixes
1. [Most impactful change]
2. [Second most impactful]
3. ...
4. ...
5. ...

## Strengths (Keep These)
- [What the candidate is already doing well]
```

### 2. Optimized Resume (`optimize` and `full` modes)

Produce the complete rewritten resume in Markdown. Follow the template structure below:

```markdown
# [Full Name]

| Field        | Value                              |
|-------------|-------------------------------------|
| Phone       | [phone number]                      |
| Email       | [email address]                     |
| GitHub      | [github link]                       |
| Blog        | [blog link]                         |
| Position    | [target role]                       |
| Experience  | [X years]                           |
| Location    | [city]                              |

---

## Profile

> [3-5 lines summarizing core competitive advantages with quantified highlights]

---

## Technical Skills

### Languages
- **[Language]** ([X years], [proficiency]) | [frameworks]

### Frameworks & Middleware
- **[Category]**: [technologies listed]

### DevOps & Cloud
- **[Category]**: [tools listed]

---

## Work Experience

### [Company] — [Title] | [Start] - [End]

**Context:** [One line on the company/team's business]

- [STAR-format bullet with quantified result]
- [STAR-format bullet with quantified result]

---

## Key Projects

### [Project Name] | [Role] | [Timeline]

**Stack:** [Core technologies]
**Description:** [2-3 sentences on scope and scale]
**Contributions:**
- [Specific contribution with metrics]
- [Specific contribution with metrics]

**Outcomes:**
- [Quantified business or technical impact]

---

## Education

### [School] — [Major] — [Degree] | [Start] - [End]

---

## Certifications & Honors

- [Cert/award] — [date]

---

## Open Source & Community

- **GitHub:** [link] — [stats]
- **Blog:** [link] — [stats]
```

## Pre-flight Checklist

Before beginning, confirm:

- [ ] Resume is in Markdown format (`.md` extension)
- [ ] User has provided the resume file path or pasted content
- [ ] Target role is specified or can be inferred from resume content
- [ ] Output directory exists and is writable

## Process

Follow these steps in order:

1. **Read the resume** — Parse the Markdown resume provided by the user (file path or pasted content). If neither is provided, ask the user to supply the resume.

2. **Identify target role** — Check if the user specified a target position. If not, infer from the resume content. Adjust evaluation weights accordingly:
   - Junior Dev: emphasize skills, education, projects
   - Senior Dev: emphasize projects, quantified impact, technical depth
   - Architect: emphasize projects, impact, soft skills, strategic thinking
   - Tech Lead/Manager: emphasize work experience, team impact, soft skills
   - Full-Stack: emphasize skill breadth, project variety, adaptability

3. **Score each dimension** — Evaluate all 10 dimensions using the scoring rubric below. Record scores and specific observations.

4. **Generate review report** — Produce the formatted report with scores, per-dimension analysis, before/after examples, and the top 5 priority fixes.

5. **Rewrite the resume** — Apply all improvements to produce a complete optimized resume. Follow these rules:
   - [x] Preserve all factual information — never fabricate experience, skills, or metrics
   - [x] Restructure for clarity and impact
   - [x] Rewrite descriptions using the STAR method
   - [x] Add quantified data placeholders where metrics are missing: `[add: specific improvement %]`
   - [x] Normalize technical terminology (correct capitalization, spelling)
   - [x] Ensure consistent formatting throughout
   - [ ] Do NOT invent projects, skills, or experiences that don't exist
   - [ ] Do NOT alter the original timeline of employment or education

6. **Save outputs** — Write the results to the project workspace:
   - `{input_filename}_review.md` — the review report
   - `{input_filename}_optimized.md` — the optimized resume
   - Default output directory: `/opt/data/my_project/profile_valut/output/`

7. **Present to user** — Share the review summary (scores + top 5 fixes) and the complete optimized resume. Mention where the files were saved.

## Scoring Rubric

Each dimension is scored 1-10:

| Dimension | 9-10 (Excellent) | 5-7 (Adequate) | 1-4 (Needs Work) |
|-----------|-----------------|----------------|-------------------|
| Structure & Layout | Clear sections, clean Markdown, 1-2 pages, zero typos | Mostly organized, minor issues | Confusing layout, missing sections, many errors |
| Executive Summary | 3-5 lines with quantified highlights and differentiation | Has a summary but generic or vague | No summary or misleading |
| Technical Skills | Categorized, proficiency levels noted, role-relevant | Listed but uncategorized or missing levels | Barely mentioned or irrelevant |
| Work Experience | STAR format, quantified, reverse-chronological, specific | Descriptions present but vague ("responsible for...") | Missing, disordered, or undetailed |
| Project Highlights | Structured (name/role/stack/impact), showcases technical depth | Some detail but inconsistent or missing metrics | No projects or only mentions without detail |
| Quantified Impact | Multiple specific metrics (QPS, %, $, users, latency) | Some numbers but sparse | No quantified results anywhere |
| Keywords & ATS | Role-critical keywords present, correct spelling/casing | Most keywords covered, minor issues | Missing critical keywords, misspellings |
| Education & Certs | Complete, concise, relevant certs listed | Basic info present | Incomplete or confusing |
| Soft Skills & Culture | GitHub/blog/community evidence, leadership examples | Mentioned but unsupported | No evidence of soft skills |
| Tailoring & Focus | Clearly targeted at a specific role with matching emphasis | Generic but readable | Unfocused, unclear job target |

## Common Rewrite Patterns

Use these patterns when improving resume content:

### Pattern 1: Vague → STAR + Quantified

```text
Before: Responsible for backend development
After:  Led backend rewrite of the order system (Spring Boot + Redis), reducing API
        response time from 800ms to 120ms (85% improvement), handling 500K daily orders
```

### Pattern 2: Missing Metrics → Add Placeholders

```text
Before: Improved system performance
After:  Introduced Redis caching and optimized SQL queries, reducing P99 latency by
        [add: specific %], increasing QPS from [add: baseline] to [add: new value]
```

### Pattern 3: Skill Listing → Categorized with Proficiency

```text
Before: Familiar with Java
After:  **Java** (8 years, Expert) | Spring Boot / Spring Cloud / MyBatis-Plus
```

### Pattern 4: Unstructured Project → Structured Entry

```text
Before: Worked on an e-commerce platform using Vue and Java
After:  **E-Commerce Platform Redesign** | Backend Lead | 2023.03 - 2023.09
        Stack: Spring Cloud Alibaba / Vue 3 / Redis / RocketMQ
        - Designed microservice architecture, splitting monolith into 12 services
        - Implemented distributed transactions (Seata), achieving 99.99% order consistency
        - System processed 300K+ daily orders with zero downtime during peak sales
```

### Pattern 5: Irrelevant Personal Info → Professional Contact Info

```text
Before: Height, weight, marital status, ID number, home address
After:  Name, phone, email, GitHub/blog, target position, years of experience
```

## Dependencies

- Input resume must be in Markdown format
- Verify with: check that the file has `#` headings, `|` tables, or `-` lists
- If the input is not Markdown, suggest conversion first
- Verify Node.js availability for file operations:

```bash
node --version || echo "Node.js not found — install to enable file saving"
```

- Validate input file before processing:

```bash
test -f "${INPUT_FILE}" || { echo "Error: Resume file not found at ${INPUT_FILE}"; exit 1; }
```

## Error Handling

- If the resume file is not found at the specified path, check `/opt/data/my_project/profile_valut/input/` for any `.md` files
- If the resume is empty or contains no recognizable sections, ask the user to verify the input
- If the user's resume is not in Markdown, recommend converting first: "Please provide the resume in Markdown format for best results"
- If scoring produces all 1s or all 10s, re-evaluate — extreme scores usually indicate a parsing issue

## Guidelines

- **Truthfulness is paramount**: Never fabricate metrics, projects, skills, or experiences. If quantified data is missing, insert a placeholder like `[add: specific improvement %]` rather than inventing numbers
- **Personalize the critique**: Different resumes have different strengths. Consider what makes this candidate unique — apply judgment, not a cookie-cutter template
- **Every suggestion must be actionable**: Don't say "improve the summary" — show the exact rewritten summary
- **Lead with strengths**: It is recommended to acknowledge what works before pointing out problems
- **Complete output**: The optimized resume should be a complete document, not fragments
- **Consistent formatting**: All Markdown tables aligned, headings at consistent levels, bullet styles uniform
- **Cultural awareness**: Optionally adapt for the Chinese IT job market if the resume is in Chinese, and for the international market if in English

## Examples

```text
/resume-optimizer full
/resume-optimizer review
/resume-optimizer optimize
/resume-optimizer review --target senior-backend-engineer
```

When the user pastes a resume directly:

```text
User: "Here's my resume, please review it:
# John Doe
..."

Agent: [Loads resume-optimizer skill, follows Process steps 2-7]
```
