#!/usr/bin/env node

/**
 * Skills Ocean — Skill Score Reporter
 *
 * Evaluates skills using the Skillscore engine and generates HTML reports.
 *
 * Usage:
 *   node score.js <skill-name>     Score a single skill
 *   node score.js --all            Score all skills
 *   node score.js <name> --output <path>  Custom output path
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Lazy-load skillscore (compiled to dist/)
let SkillParser, SkillScorer, getLetterGrade;
try {
  const sc = require('skillscore');
  SkillParser = sc.SkillParser;
  SkillScorer = sc.SkillScorer;
  getLetterGrade = sc.getLetterGrade;
} catch (err) {
  console.error('Error: skillscore dependency not installed.');
  console.error('Run: npm install');
  process.exit(1);
}

// ─── Constants ───────────────────────────────────────────────────────

const SKILLS_DIR = path.join(__dirname, 'skills');
const REPORTS_DIR = path.join(__dirname, 'reports');

// ─── Discovery ───────────────────────────────────────────────────────

function discoverSkills(filterName) {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Error: skills/ directory not found.');
    process.exit(1);
  }

  const skills = [];
  for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const mdPath = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!fs.existsSync(mdPath)) continue;
    if (filterName && entry.name !== filterName) continue;
    skills.push(entry.name);
  }
  return skills;
}

// ─── Scoring ─────────────────────────────────────────────────────────

async function scoreSkill(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName);
  if (!fs.existsSync(skillPath)) {
    console.error(`Error: Skill "${skillName}" not found at ${skillPath}`);
    return null;
  }

  const parser = new SkillParser();
  const scorer = new SkillScorer();

  const parsed = await parser.parseSkill(skillPath);
  const result = await scorer.scoreSkill(parsed);
  return result;
}

// ─── HTML Reporter ───────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const TYPE_ICONS = {
  pass: '&#10004;',   // ✓
  fail: '&#10008;',   // ✗
  warning: '&#9888;', // ⚠
  info: '&#8505;',    // ℹ
};

const TYPE_COLORS = {
  pass: '#22c55e',
  fail: '#ef4444',
  warning: '#f59e0b',
  info: '#6366f1',
};

function gradeColor(grade) {
  if (grade.startsWith('A')) return '#22c55e';
  if (grade.startsWith('B')) return '#3b82f6';
  if (grade.startsWith('C')) return '#f59e0b';
  if (grade.startsWith('D')) return '#f97316';
  return '#ef4444';
}

function progressBarHTML(score, max) {
  const pct = Math.round((score / max) * 100);
  const filled = Math.round((score / max) * 12);
  const empty = 12 - filled;
  return `<span class="bar"><span class="bar-fill" style="width:${pct}%"></span><span class="bar-label">${score}/${max}</span></span>`;
}

function findingsHTML(findings) {
  return findings.map((f) => {
    const icon = TYPE_ICONS[f.type] || '';
    const color = TYPE_COLORS[f.type] || '#666';
    return `<li class="finding finding--${f.type}"><span class="finding-icon" style="color:${color}">${icon}</span><span class="finding-text">${escapeHtml(f.message)}</span></li>`;
  }).join('\n');
}

function generateHTMLReport(result) {
  const skill = result.skill;
  const now = result.timestamp;

  // Category rows
  const categoryRows = result.categoryScores.map((cs) => {
    const cat = cs.category;
    return `
    <tr>
      <td class="cat-name">${escapeHtml(cat.name)}</td>
      <td class="cat-score">${cs.score}/${cat.maxScore}</td>
      <td class="cat-bar">${progressBarHTML(cs.score, cat.maxScore)}</td>
      <td class="cat-weight">×${Math.round(cat.weight * 100)}%</td>
    </tr>`;
  }).join('\n');

  // Category detail sections
  const categoryDetails = result.categoryScores.map((cs) => {
    const cat = cs.category;
    const gradeForCat = getLetterGrade(cs.percentage);
    const gradeClr = gradeColor(gradeForCat);
    return `
  <section class="detail-section">
    <h3>${escapeHtml(cat.name)} <span class="detail-score">${cs.score}/${cat.maxScore}</span> <span class="detail-grade" style="color:${gradeClr}">${gradeForCat}</span></h3>
    <p class="detail-desc">${escapeHtml(cat.description)}</p>
    <ul class="findings-list">
      ${findingsHTML(cs.findings)}
    </ul>
  </section>`;
  }).join('\n');

  // Action items (collect all fails and warnings)
  const actionItems = [];
  result.categoryScores.forEach((cs) => {
    cs.findings.forEach((f) => {
      if (f.type === 'fail' || f.type === 'warning') {
        actionItems.push({ type: f.type, message: f.message, category: cs.category.name });
      }
    });
  });

  const actionItemsHTML = actionItems.length > 0
    ? actionItems.map((a) => {
        const icon = TYPE_ICONS[a.type] || '';
        const color = TYPE_COLORS[a.type] || '#666';
        return `<li><span style="color:${color}">${icon}</span> <strong>[${escapeHtml(a.category)}]</strong> ${escapeHtml(a.message)}</li>`;
      }).join('\n')
    : '<li>All checks passed — great job!</li>';

  const totalPct = Math.round(result.percentage);
  const gradeClr = gradeColor(result.letterGrade);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SkillScore — ${escapeHtml(skill.name)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; padding: 2rem; max-width: 960px; margin: 0 auto; }
  h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
  h2 { font-size: 1.3rem; margin: 2rem 0 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
  h3 { font-size: 1.1rem; }
  .subtitle { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }

  /* Score hero */
  .hero { display: flex; align-items: center; gap: 2rem; background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 2rem; }
  .score-circle { width: 120px; height: 120px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 800; color: #fff; background: conic-gradient(${gradeClr} ${totalPct}%, #e2e8f0 ${totalPct}%); flex-shrink: 0; }
  .score-inner { width: 90px; height: 90px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-number { font-size: 2rem; font-weight: 800; color: ${gradeClr}; line-height: 1; }
  .score-label { font-size: 0.75rem; color: #64748b; }
  .hero-info { flex: 1; }
  .hero-info .grade { font-size: 1.5rem; font-weight: 700; color: ${gradeClr}; }
  .hero-info .skill-name { font-size: 1.1rem; color: #334155; margin-top: 0.5rem; }
  .hero-info .skill-desc { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }

  /* Category table */
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  th { background: #f1f5f9; text-align: left; padding: 0.75rem 1rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
  td { padding: 0.75rem 1rem; border-top: 1px solid #f1f5f9; vertical-align: middle; }
  .cat-name { font-weight: 600; }
  .cat-score { font-weight: 700; white-space: nowrap; }
  .cat-bar { width: 40%; }
  .bar { display: inline-block; position: relative; width: 100%; height: 22px; background: #e2e8f0; border-radius: 11px; overflow: hidden; vertical-align: middle; }
  .bar-fill { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg, #3b82f6, #22c55e); border-radius: 11px; transition: width 0.3s; }
  .bar-label { position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #334155; }
  .cat-weight { color: #94a3b8; font-size: 0.85rem; white-space: nowrap; }

  /* Detail sections */
  .detail-section { background: #fff; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .detail-score { font-weight: 700; color: #334155; }
  .detail-grade { font-weight: 700; }
  .detail-desc { color: #64748b; font-size: 0.85rem; margin-top: 0.5rem; }

  /* Findings */
  .findings-list { list-style: none; padding: 0; margin-top: 0.75rem; }
  .finding { padding: 0.4rem 0; display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.9rem; }
  .finding-icon { font-weight: bold; flex-shrink: 0; width: 1.25rem; }
  .finding--pass .finding-text { color: #16a34a; }
  .finding--fail .finding-text { color: #dc2626; }
  .finding--warning .finding-text { color: #d97706; }
  .finding--info .finding-text { color: #4f46e5; }

  /* Action items */
  .action-items { list-style: none; padding: 0; }
  .action-items li { padding: 0.5rem 0; font-size: 0.9rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 0.5rem; }
  .action-items li:last-child { border-bottom: none; }

  @media (max-width: 600px) {
    .hero { flex-direction: column; text-align: center; }
    .cat-bar { display: none; }
  }
</style>
</head>
<body>

<h1>SkillScore Report</h1>
<p class="subtitle">Generated ${now.toLocaleString()} — Skillscore v2.0.2</p>

<div class="hero">
  <div class="score-circle">
    <div class="score-inner">
      <span class="score-number">${totalPct}%</span>
      <span class="score-label">SCORE</span>
    </div>
  </div>
  <div class="hero-info">
    <div class="grade">Grade: ${result.letterGrade}</div>
    <div class="skill-name">${escapeHtml(skill.name)}</div>
    <div class="skill-desc">${escapeHtml(skill.description)}</div>
    <div class="skill-desc" style="margin-top:0.5rem">Weighted: ${result.totalScore.toFixed(2)}/10 · ${result.skill.bodyLineCount} body lines</div>
  </div>
</div>

<h2>Category Scores</h2>
<table>
  <thead>
    <tr><th style="width:30%">Category</th><th style="width:12%">Score</th><th style="width:45%">Progress</th><th style="width:13%">Weight</th></tr>
  </thead>
  <tbody>
    ${categoryRows}
  </tbody>
</table>

<h2>Detailed Findings</h2>
${categoryDetails}

<h2>Action Items</h2>
<ul class="action-items">
  ${actionItemsHTML}
</ul>

</body>
</html>`;
}

// ─── CLI ─────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { all: false, output: null, skillName: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--all') {
      args.all = true;
    } else if (argv[i] === '--output' && argv[i + 1]) {
      args.output = argv[++i];
    } else if (!args.skillName) {
      args.skillName = argv[i];
    }
  }
  return args;
}

function resolveOutputPath(skillName, customOutput) {
  if (customOutput) {
    const p = path.resolve(customOutput);
    if (!p.endsWith('.html')) {
      return path.join(p, `${skillName}-score.html`);
    }
    return p;
  }
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  return path.join(REPORTS_DIR, `${skillName}-score.html`);
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.all) {
    const skillNames = discoverSkills();
    if (skillNames.length === 0) {
      console.error('No skills found.');
      process.exit(1);
    }

    console.log(`\nScoring ${skillNames.length} skill(s)...\n`);
    for (const name of skillNames) {
      process.stdout.write(`  Scoring "${name}"... `);
      const result = await scoreSkill(name);
      if (result) {
        const outPath = resolveOutputPath(name, args.output);
        const html = generateHTMLReport(result);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html, 'utf-8');
        console.log(`${result.letterGrade} (${Math.round(result.percentage)}%) → ${outPath}`);
      } else {
        console.log('FAILED');
      }
    }
    console.log('\nDone!\n');
    return;
  }

  if (!args.skillName) {
    console.error('Usage: node score.js <skill-name>');
    console.error('       node score.js --all');
    console.error('       node score.js <skill-name> --output <path>');
    process.exit(1);
  }

  const skillNames = discoverSkills(args.skillName);
  if (skillNames.length === 0) {
    console.error(`Error: Skill "${args.skillName}" not found.`);
    process.exit(1);
  }

  const name = skillNames[0];
  console.log(`\nScoring "${name}"...\n`);
  const result = await scoreSkill(name);
  if (!result) {
    console.error('Scoring failed.');
    process.exit(1);
  }

  const outPath = resolveOutputPath(name, args.output);
  const html = generateHTMLReport(result);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log(`Grade: ${result.letterGrade} (${Math.round(result.percentage)}%)`);
  console.log(`Report: ${outPath}\n`);
}

main();
