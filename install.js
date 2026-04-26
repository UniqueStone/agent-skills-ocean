#!/usr/bin/env node

/**
 * Skills Ocean — Universal AI Agent Skills Installer
 *
 * Installs skills to various AI coding agents:
 *   Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Codex, Gemini CLI
 *
 * Usage:
 *   node install.js [options]
 *
 * Options:
 *   --agent <names>    Target agent(s), comma-separated (default: all)
 *   --target <path>    Target project directory (default: .)
 *   --skill <name>     Install a specific skill (default: all)
 *   --list             List available skills and supported agents
 *   --force            Overwrite existing files without prompting
 *   --dry-run          Preview changes without writing files
 *   --uninstall        Remove installed skills from target
 *   -h, --help         Show help
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Constants ───────────────────────────────────────────────────────

const SKILLS_DIR = path.join(__dirname, 'skills');
const MARKER = {
  start: (n) => `<!-- skills-ocean:start:${n} -->`,
  end: (n) => `<!-- skills-ocean:end:${n} -->`,
};

// ─── Skill Discovery ─────────────────────────────────────────────────

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

    const content = fs.readFileSync(mdPath, 'utf-8');
    skills.push({
      name: entry.name,
      content,
      description: extractDescription(content),
    });
  }

  if (skills.length === 0) {
    console.error(
      'No skills found' + (filterName ? ` matching "${filterName}"` : '') + '.'
    );
    process.exit(1);
  }

  return skills;
}

function extractDescription(content) {
  let inFrontmatter = false;
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!inFrontmatter && t === '---') {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter && t === '---') {
      inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) continue;
    if (!t || t.startsWith('#')) continue;
    return t.replace(/\s+/g, ' ').substring(0, 120);
  }

  return 'Custom skill from Skills Ocean';
}

// ─── File Utilities ──────────────────────────────────────────────────

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeIfOk(filePath, content, opts) {
  const rel = path.relative(opts.targetDir, filePath);

  if (opts.dryRun) {
    console.log(`  → Would write: ${rel}`);
    return true;
  }

  if (fs.existsSync(filePath) && !opts.force) {
    console.log(`  ⚠ Skipped (exists): ${rel}`);
    return false;
  }

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ Installed: ${rel}`);
  return true;
}

function removeIfOk(filePath, opts) {
  const rel = path.relative(opts.targetDir, filePath);

  if (opts.dryRun) {
    console.log(`  → Would remove: ${rel}`);
    return true;
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  ✓ Removed: ${rel}`);
    return true;
  }

  console.log(`  ⚠ Not found: ${rel}`);
  return false;
}

/**
 * Inject (or update) a skill section in a single instruction file.
 * Uses HTML-comment markers so re-runs can update individual skills safely.
 */
function injectSkillSection(filePath, skill, opts) {
  const rel = path.relative(opts.targetDir, filePath);
  const section = [
    '',
    MARKER.start(skill.name),
    `## ${skill.name}`,
    '',
    skill.content,
    MARKER.end(skill.name),
    '',
  ].join('\n');

  if (opts.dryRun) {
    console.log(`  → Would inject: ${rel} [${skill.name}]`);
    return true;
  }

  if (fs.existsSync(filePath)) {
    let existing = fs.readFileSync(filePath, 'utf-8');
    const sMk = MARKER.start(skill.name);
    const eMk = MARKER.end(skill.name);
    const si = existing.indexOf(sMk);
    const ei = existing.indexOf(eMk);

    if (si !== -1 && ei !== -1) {
      if (!opts.force) {
        console.log(`  ⚠ Skipped (exists): ${rel} [${skill.name}]`);
        return false;
      }
      existing =
        existing.substring(0, si) +
        section.trimEnd() +
        existing.substring(ei + eMk.length);
      fs.writeFileSync(filePath, existing, 'utf-8');
      console.log(`  ✓ Updated: ${rel} [${skill.name}]`);
      return true;
    }

    existing = existing.trimEnd() + '\n' + section;
    fs.writeFileSync(filePath, existing, 'utf-8');
    console.log(`  ✓ Appended: ${rel} [${skill.name}]`);
    return true;
  }

  const fresh = '# Skills Ocean — AI Agent Instructions\n' + section;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, fresh, 'utf-8');
  console.log(`  ✓ Created: ${rel} [${skill.name}]`);
  return true;
}

/**
 * Remove a skill section from a single instruction file.
 * Removes the file entirely if no other content remains.
 */
function removeSkillSection(filePath, skillName, opts) {
  const rel = path.relative(opts.targetDir, filePath);

  if (opts.dryRun) {
    console.log(`  → Would remove section: ${rel} [${skillName}]`);
    return true;
  }

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ Not found: ${rel}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const sMk = MARKER.start(skillName);
  const eMk = MARKER.end(skillName);
  const si = content.indexOf(sMk);
  const ei = content.indexOf(eMk);

  if (si === -1 || ei === -1) {
    console.log(`  ⚠ Section not found: ${rel} [${skillName}]`);
    return false;
  }

  content =
    content.substring(0, si).trimEnd() + content.substring(ei + eMk.length);

  if (content.trim().length === 0 || content.trim() === '# Skills Ocean — AI Agent Instructions') {
    fs.unlinkSync(filePath);
    console.log(`  ✓ Removed (empty): ${rel}`);
  } else {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ Removed section: ${rel} [${skillName}]`);
  }

  return true;
}

// ─── Agent Definitions ───────────────────────────────────────────────

const agents = {
  'claude-code': {
    name: 'Claude Code',
    description: 'Anthropic Claude Code CLI',
    install(skills, targetDir, opts) {
      for (const s of skills) {
        writeIfOk(
          path.join(targetDir, 'skills', s.name, 'SKILL.md'),
          s.content,
          opts
        );
      }
    },
    uninstall(skills, targetDir, opts) {
      for (const s of skills) {
        removeIfOk(path.join(targetDir, 'skills', s.name, 'SKILL.md'), opts);
      }
    },
  },

  cursor: {
    name: 'Cursor',
    description: 'AI-first code editor',
    install(skills, targetDir, opts) {
      for (const s of skills) {
        const mdc = [
          '---',
          `description: ${s.description}`,
          'alwaysApply: false',
          '---',
          '',
          s.content,
        ].join('\n');
        writeIfOk(
          path.join(targetDir, '.cursor', 'rules', `${s.name}.mdc`),
          mdc,
          opts
        );
      }
    },
    uninstall(skills, targetDir, opts) {
      for (const s of skills) {
        removeIfOk(
          path.join(targetDir, '.cursor', 'rules', `${s.name}.mdc`),
          opts
        );
      }
    },
  },

  windsurf: {
    name: 'Windsurf',
    description: 'AI-powered IDE by Codeium',
    install(skills, targetDir, opts) {
      for (const s of skills) {
        const mdc = [
          '---',
          `description: ${s.description}`,
          'alwaysApply: false',
          '---',
          '',
          s.content,
        ].join('\n');
        writeIfOk(
          path.join(targetDir, '.windsurf', 'rules', `${s.name}.mdc`),
          mdc,
          opts
        );
      }
    },
    uninstall(skills, targetDir, opts) {
      for (const s of skills) {
        removeIfOk(
          path.join(targetDir, '.windsurf', 'rules', `${s.name}.mdc`),
          opts
        );
      }
    },
  },

  copilot: {
    name: 'GitHub Copilot',
    description: 'AI pair programmer',
    install(skills, targetDir, opts) {
      const file = path.join(targetDir, '.github', 'copilot-instructions.md');
      for (const s of skills) {
        injectSkillSection(file, s, opts);
      }
    },
    uninstall(skills, targetDir, opts) {
      const file = path.join(targetDir, '.github', 'copilot-instructions.md');
      for (const s of skills) {
        removeSkillSection(file, s.name, opts);
      }
    },
  },

  cline: {
    name: 'Cline',
    description: 'Autonomous AI coding agent for VS Code',
    install(skills, targetDir, opts) {
      for (const s of skills) {
        writeIfOk(
          path.join(targetDir, '.clinerules', `${s.name}.md`),
          s.content,
          opts
        );
      }
    },
    uninstall(skills, targetDir, opts) {
      for (const s of skills) {
        removeIfOk(
          path.join(targetDir, '.clinerules', `${s.name}.md`),
          opts
        );
      }
    },
  },

  codex: {
    name: 'OpenAI Codex',
    description: 'OpenAI coding agent CLI',
    install(skills, targetDir, opts) {
      const file = path.join(targetDir, 'AGENTS.md');
      for (const s of skills) {
        injectSkillSection(file, s, opts);
      }
    },
    uninstall(skills, targetDir, opts) {
      const file = path.join(targetDir, 'AGENTS.md');
      for (const s of skills) {
        removeSkillSection(file, s.name, opts);
      }
    },
  },

  gemini: {
    name: 'Gemini CLI',
    description: 'Google Gemini command-line tool',
    install(skills, targetDir, opts) {
      const file = path.join(targetDir, 'GEMINI.md');
      for (const s of skills) {
        injectSkillSection(file, s, opts);
      }
    },
    uninstall(skills, targetDir, opts) {
      const file = path.join(targetDir, 'GEMINI.md');
      for (const s of skills) {
        removeSkillSection(file, s.name, opts);
      }
    },
  },
};

// ─── Argument Parsing ────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    agent: null,
    target: '.',
    skill: null,
    list: false,
    force: false,
    dryRun: false,
    uninstall: false,
    skipScore: false,
    scoreOnly: false,
    help: false,
  };

  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--agent':
        args.agent = argv[++i]?.split(',').map((s) => s.trim()) || null;
        break;
      case '--target':
        args.target = argv[++i] || '.';
        break;
      case '--skill':
        args.skill = argv[++i] || null;
        break;
      case '--list':
        args.list = true;
        break;
      case '--force':
        args.force = true;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--uninstall':
        args.uninstall = true;
        break;
      case '--skip-score':
        args.skipScore = true;
        break;
      case '--score-only':
        args.scoreOnly = true;
        break;
      case '-h':
      case '--help':
        args.help = true;
        break;
    }
  }

  return args;
}

// ─── Display ──────────────────────────────────────────────────────────

function showHelp() {
  console.log(`
Skills Ocean — Universal AI Agent Skills Installer

Usage:
  node install.js [options]

Options:
  --agent <names>    Target agent(s), comma-separated
                     Choices: ${Object.keys(agents).join(', ')}
                     Default: all agents

  --target <path>    Target project directory (default: .)
  --skill <name>     Install a specific skill (default: all)
  --list             List available skills and supported agents
  --force            Overwrite existing files
  --dry-run          Preview changes without writing
  --uninstall        Remove installed skills instead
  --skip-score       Skip skill quality scoring after installation
  --score-only       Only run scoring, skip installation
  -h, --help         Show this help

Examples:
  node install.js                                    # Install all skills for all agents
  node install.js --agent cursor,windsurf            # Install for specific agents
  node install.js --skill design-with-ascii          # Install a specific skill
  node install.js --target ~/my-project              # Install to another project
  node install.js --agent cursor --force             # Force reinstall for Cursor
  node install.js --uninstall --agent copilot        # Remove skills from Copilot
  node install.js --list                             # Show available skills
  node install.js --skip-score                       # Install without scoring
  node install.js --score-only                       # Score only, no installation
`.trim());
}

function showList() {
  const skills = discoverSkills(null);

  console.log('\nAvailable Skills:');
  console.log('-'.repeat(60));
  for (const s of skills) {
    const desc = s.description.length > 45 ? s.description.substring(0, 42) + '...' : s.description;
    console.log(`  ${s.name.padEnd(24)} ${desc}`);
  }

  console.log('\nSupported Agents:');
  console.log('-'.repeat(60));
  for (const [id, a] of Object.entries(agents)) {
    console.log(`  ${id.padEnd(16)} ${a.name.padEnd(20)} ${a.description}`);
  }
  console.log();
}

// ─── Install / Uninstall ─────────────────────────────────────────────

function resolveAgentKeys(requested) {
  const keys = requested || Object.keys(agents);

  for (const k of keys) {
    if (!agents[k]) {
      console.error(
        `Error: Unknown agent "${k}". Available: ${Object.keys(agents).join(', ')}`
      );
      process.exit(1);
    }
  }

  return keys;
}

function runScore(skillFilter) {
  const { execSync } = require('child_process');
  const scoreScript = path.join(__dirname, 'score.js');
  if (!fs.existsSync(scoreScript)) return;

  const cmd = skillFilter
    ? `node "${scoreScript}" ${skillFilter}`
    : `node "${scoreScript}" --all`;

  try {
    execSync(cmd, { stdio: 'inherit', cwd: __dirname });
  } catch (err) {
    console.error('Warning: Scoring failed (install skillscore with: npm install)');
  }
}

function runInstall(args) {
  if (args.scoreOnly) {
    runScore(args.skill);
    return;
  }

  const targetDir = path.resolve(args.target);

  if (!fs.existsSync(targetDir)) {
    console.error(`Error: Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  const skills = discoverSkills(args.skill);
  const agentKeys = resolveAgentKeys(args.agent);
  const action = args.uninstall ? 'Uninstalling' : 'Installing';

  console.log(
    `\n${action} ${skills.length} skill(s) ${args.uninstall ? 'from' : 'to'} ${agentKeys.length} agent(s)...`
  );
  console.log(`Target: ${targetDir}\n`);

  const opts = { targetDir, force: args.force, dryRun: args.dryRun };

  for (const key of agentKeys) {
    const agent = agents[key];
    console.log(`[${agent.name}]`);

    if (args.uninstall) {
      agent.uninstall(skills, targetDir, opts);
    } else {
      agent.install(skills, targetDir, opts);
    }

    console.log();
  }

  if (args.dryRun) {
    console.log('(dry-run — no files were changed)');
  }

  console.log('Done!');

  // Run scoring after successful install (unless skipped or uninstalling)
  if (!args.skipScore && !args.uninstall && !args.dryRun) {
    console.log('\nGenerating skill quality reports...');
    runScore(args.skill);
  } else {
    console.log();
  }
}

// ─── Main ────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    showHelp();
    return;
  }

  if (args.list) {
    showList();
    return;
  }

  runInstall(args);
}

main();
