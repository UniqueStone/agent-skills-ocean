#!/usr/bin/env bash
#
# Skills Ocean — Universal AI Agent Skills Installer
#
# Installs skills to various AI coding agents:
#   Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Codex, Gemini CLI
#
# Usage:
#   ./install.sh [options]
#
# Options:
#   --agent <names>    Target agent(s), comma-separated (default: all)
#   --target <path>    Target project directory (default: .)
#   --skill <name>     Install a specific skill (default: all)
#   --list             List available skills and supported agents
#   --force            Overwrite existing files without prompting
#   --dry-run          Preview changes without writing files
#   --uninstall        Remove installed skills from target
#   -h, --help         Show help
#

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/skills"

# ─── Defaults ─────────────────────────────────────────────────────────

AGENT=""
TARGET_DIR="."
SKILL_FILTER=""
FORCE=0
DRY_RUN=0
UNINSTALL=0
LIST=0

# ─── Agent Registry ───────────────────────────────────────────────────

# Space-separated list of all supported agent keys
ALL_AGENTS="claude-code cursor windsurf copilot cline codex gemini"

# ─── Utility Functions ────────────────────────────────────────────────

die() {
    echo "Error: $*" >&2
    exit 1
}

info() {
    echo "  $*"
}

rel_path() {
    local full="$1"
    local base="$2"
    echo "${full#"$base"/}"
}

ensure_dir() {
    mkdir -p "$1"
}

# Extract the first non-heading, non-empty line from a markdown file as a description
extract_description() {
    local file="$1"
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Trim leading whitespace
        local trimmed="${line#"${line%%[![:space:]]*}"}"
        # Trim trailing whitespace
        trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"
        # Skip empty lines and headings
        [[ -z "$trimmed" || "$trimmed" == \#* ]] && continue
        # Truncate to 120 chars
        echo "${trimmed:0:120}"
        return 0
    done < "$file"
    echo "Custom skill from Skills Ocean"
}

# ─── Skill Discovery ─────────────────────────────────────────────────

# Populate SKILL_NAMES array with discovered skill directory names
SKILL_NAMES=()

discover_skills() {
    [[ -d "$SKILLS_DIR" ]] || die "skills/ directory not found."

    SKILL_NAMES=()
    for skill_dir in "$SKILLS_DIR"/*/; do
        [[ -d "$skill_dir" ]] || continue
        local name
        name="$(basename "$skill_dir")"
        [[ -f "$skill_dir/SKILL.md" ]] || continue
        if [[ -n "$SKILL_FILTER" && "$name" != "$SKILL_FILTER" ]]; then
            continue
        fi
        SKILL_NAMES+=("$name")
    done

    if [[ ${#SKILL_NAMES[@]} -eq 0 ]]; then
        if [[ -n "$SKILL_FILTER" ]]; then
            die "No skills found matching \"$SKILL_FILTER\"."
        else
            die "No skills found."
        fi
    fi
}

# ─── File Operations ─────────────────────────────────────────────────

# Write content to a file (respecting dry-run and force flags).
# Usage: write_file <dest_path> <source_file_or_content> [is_content]
#   If is_content="1", second arg is the content string itself.
#   Otherwise, second arg is a file path to copy from.
write_file() {
    local dest="$1"
    local source="$2"
    local is_content="${3:-0}"
    local rel
    rel="$(rel_path "$dest" "$TARGET_DIR")"

    if [[ "$DRY_RUN" -eq 1 ]]; then
        info "→ Would write: $rel"
        return 0
    fi

    if [[ -f "$dest" && "$FORCE" -ne 1 ]]; then
        info "⚠ Skipped (exists): $rel"
        return 1
    fi

    ensure_dir "$(dirname "$dest")"

    if [[ "$is_content" = "1" ]]; then
        printf '%s\n' "$source" > "$dest"
    else
        cp "$source" "$dest"
    fi

    info "✓ Installed: $rel"
    return 0
}

# Remove a file (respecting dry-run flag)
remove_file() {
    local target="$1"
    local rel
    rel="$(rel_path "$target" "$TARGET_DIR")"

    if [[ "$DRY_RUN" -eq 1 ]]; then
        info "→ Would remove: $rel"
        return 0
    fi

    if [[ -f "$target" ]]; then
        rm -f "$target"
        info "✓ Removed: $rel"
        return 0
    fi

    info "⚠ Not found: $rel"
    return 1
}

# Inject a skill section into a single instruction file using HTML markers.
# Usage: inject_section <file_path> <skill_name> <skill_md_path>
inject_section() {
    local file="$1"
    local skill_name="$2"
    local skill_md="$3"
    local rel
    rel="$(rel_path "$file" "$TARGET_DIR")"

    local start_marker="<!-- skills-ocean:start:${skill_name} -->"
    local end_marker="<!-- skills-ocean:end:${skill_name} -->"

    if [[ "$DRY_RUN" -eq 1 ]]; then
        info "→ Would inject: $rel [$skill_name]"
        return 0
    fi

    # File doesn't exist — create it
    if [[ ! -f "$file" ]]; then
        ensure_dir "$(dirname "$file")"
        {
            echo "# Skills Ocean — AI Agent Instructions"
            printf '\n%s\n## %s\n\n' "$start_marker" "$skill_name"
            cat "$skill_md"
            printf '\n%s\n' "$end_marker"
        } > "$file"
        info "✓ Created: $rel [$skill_name]"
        return 0
    fi

    # File exists — check for existing markers
    if grep -qF "$start_marker" "$file" 2>/dev/null; then
        if [[ "$FORCE" -ne 1 ]]; then
            info "⚠ Skipped (exists): $rel [$skill_name]"
            return 1
        fi

        # Replace the existing section using line-by-line reconstruction
        local in_section=0
        local tmp="${file}.so.tmp"
        : > "$tmp"

        while IFS= read -r line || [[ -n "$line" ]]; do
            if [[ "$line" = "$start_marker" ]]; then
                in_section=1
                {
                    printf '%s\n' "$start_marker"
                    printf '## %s\n\n' "$skill_name"
                    cat "$skill_md"
                    printf '\n%s' "$end_marker"
                } >> "$tmp"
                continue
            fi
            if [[ "$line" = "$end_marker" ]]; then
                in_section=0
                continue
            fi
            [[ "$in_section" -eq 1 ]] && continue
            printf '%s\n' "$line" >> "$tmp"
        done < "$file"

        mv "$tmp" "$file"
        info "✓ Updated: $rel [$skill_name]"
        return 0
    fi

    # File exists but no markers — append section
    {
        printf '\n%s\n## %s\n\n' "$start_marker" "$skill_name"
        cat "$skill_md"
        printf '\n%s\n' "$end_marker"
    } >> "$file"
    info "✓ Appended: $rel [$skill_name]"
    return 0
}

# Remove a skill section from a single instruction file.
# Deletes the file if nothing meaningful remains.
# Usage: remove_section <file_path> <skill_name>
remove_section() {
    local file="$1"
    local skill_name="$2"
    local rel
    rel="$(rel_path "$file" "$TARGET_DIR")"

    local start_marker="<!-- skills-ocean:start:${skill_name} -->"
    local end_marker="<!-- skills-ocean:end:${skill_name} -->"

    if [[ "$DRY_RUN" -eq 1 ]]; then
        info "→ Would remove section: $rel [$skill_name]"
        return 0
    fi

    if [[ ! -f "$file" ]]; then
        info "⚠ Not found: $rel"
        return 1
    fi

    if ! grep -qF "$start_marker" "$file" 2>/dev/null; then
        info "⚠ Section not found: $rel [$skill_name]"
        return 1
    fi

    # Reconstruct file without the marked section
    local in_section=0
    local tmp="${file}.so.tmp"
    : > "$tmp"

    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" = "$start_marker" ]] && { in_section=1; continue; }
        [[ "$line" = "$end_marker" ]] && { in_section=0; continue; }
        [[ "$in_section" -eq 1 ]] && continue
        printf '%s\n' "$line" >> "$tmp"
    done < "$file"

    # Check if anything meaningful remains
    local remaining
    remaining="$(grep -v '^[[:space:]]*$' "$tmp" | grep -v '^# Skills Ocean' || true)"
    if [[ -z "$remaining" ]]; then
        rm -f "$tmp" "$file"
        info "✓ Removed (empty): $rel"
    else
        mv "$tmp" "$file"
        info "✓ Removed section: $rel [$skill_name]"
    fi

    return 0
}

# ─── Agent Installers ─────────────────────────────────────────────────

install_agent() {
    local agent_key="$1"

    case "$agent_key" in
        claude-code)
            for name in "${SKILL_NAMES[@]}"; do
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_file "$TARGET_DIR/skills/$name/SKILL.md"
                else
                    write_file "$TARGET_DIR/skills/$name/SKILL.md" "$SKILLS_DIR/$name/SKILL.md"
                fi
            done
            ;;
        cursor)
            for name in "${SKILL_NAMES[@]}"; do
                local dest="$TARGET_DIR/.cursor/rules/${name}.mdc"
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_file "$dest"
                else
                    local desc
                    desc="$(extract_description "$SKILLS_DIR/$name/SKILL.md")"
                    local mdc
                    mdc="$(printf -- '---\ndescription: %s\nalwaysApply: false\n---\n\n' "$desc"; cat "$SKILLS_DIR/$name/SKILL.md")"
                    write_file "$dest" "$mdc" 1
                fi
            done
            ;;
        windsurf)
            for name in "${SKILL_NAMES[@]}"; do
                local dest="$TARGET_DIR/.windsurf/rules/${name}.mdc"
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_file "$dest"
                else
                    local desc
                    desc="$(extract_description "$SKILLS_DIR/$name/SKILL.md")"
                    local mdc
                    mdc="$(printf -- '---\ndescription: %s\nalwaysApply: false\n---\n\n' "$desc"; cat "$SKILLS_DIR/$name/SKILL.md")"
                    write_file "$dest" "$mdc" 1
                fi
            done
            ;;
        copilot)
            local instr_file="$TARGET_DIR/.github/copilot-instructions.md"
            for name in "${SKILL_NAMES[@]}"; do
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_section "$instr_file" "$name"
                else
                    inject_section "$instr_file" "$name" "$SKILLS_DIR/$name/SKILL.md"
                fi
            done
            ;;
        cline)
            for name in "${SKILL_NAMES[@]}"; do
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_file "$TARGET_DIR/.clinerules/${name}.md"
                else
                    write_file "$TARGET_DIR/.clinerules/${name}.md" "$SKILLS_DIR/$name/SKILL.md"
                fi
            done
            ;;
        codex)
            local agents_file="$TARGET_DIR/AGENTS.md"
            for name in "${SKILL_NAMES[@]}"; do
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_section "$agents_file" "$name"
                else
                    inject_section "$agents_file" "$name" "$SKILLS_DIR/$name/SKILL.md"
                fi
            done
            ;;
        gemini)
            local gemini_file="$TARGET_DIR/GEMINI.md"
            for name in "${SKILL_NAMES[@]}"; do
                if [[ "$UNINSTALL" -eq 1 ]]; then
                    remove_section "$gemini_file" "$name"
                else
                    inject_section "$gemini_file" "$name" "$SKILLS_DIR/$name/SKILL.md"
                fi
            done
            ;;
        *)
            die "Unknown agent \"$agent_key\". Available: $ALL_AGENTS"
            ;;
    esac
}

# ─── Display ──────────────────────────────────────────────────────────

show_help() {
    cat <<'HELP'
Skills Ocean — Universal AI Agent Skills Installer

Usage:
  ./install.sh [options]

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
  -h, --help         Show this help

Examples:
  ./install.sh                                    # Install all skills for all agents
  ./install.sh --agent cursor,windsurf            # Install for specific agents
  ./install.sh --skill design-with-ascii          # Install a specific skill
  ./install.sh --target ~/my-project              # Install to another project
  ./install.sh --agent cursor --force             # Force reinstall for Cursor
  ./install.sh --uninstall --agent copilot        # Remove skills from Copilot
  ./install.sh --list                             # Show available skills
HELP
}

show_list() {
    discover_skills

    echo ""
    echo "Available Skills:"
    echo "------------------------------------------------------------"
    for name in "${SKILL_NAMES[@]}"; do
        local desc
        desc="$(extract_description "$SKILLS_DIR/$name/SKILL.md")"
        if [[ ${#desc} -gt 50 ]]; then
            desc="${desc:0:47}..."
        fi
        printf "  %-24s %s\n" "$name" "$desc"
    done

    echo ""
    echo "Supported Agents:"
    echo "------------------------------------------------------------"
    printf "  %-16s %-20s %s\n" "claude-code" "Claude Code" "Anthropic Claude Code CLI"
    printf "  %-16s %-20s %s\n" "cursor" "Cursor" "AI-first code editor"
    printf "  %-16s %-20s %s\n" "windsurf" "Windsurf" "AI-powered IDE by Codeium"
    printf "  %-16s %-20s %s\n" "copilot" "GitHub Copilot" "AI pair programmer"
    printf "  %-16s %-20s %s\n" "cline" "Cline" "Autonomous AI coding agent"
    printf "  %-16s %-20s %s\n" "codex" "OpenAI Codex" "OpenAI coding agent CLI"
    printf "  %-16s %-20s %s\n" "gemini" "Gemini CLI" "Google Gemini CLI tool"
    echo ""
}

# ─── Argument Parsing ─────────────────────────────────────────────────

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --agent)
                AGENT="$2"
                shift 2
                ;;
            --target)
                TARGET_DIR="$2"
                shift 2
                ;;
            --skill)
                SKILL_FILTER="$2"
                shift 2
                ;;
            --list)
                LIST=1
                shift
                ;;
            --force)
                FORCE=1
                shift
                ;;
            --dry-run)
                DRY_RUN=1
                shift
                ;;
            --uninstall)
                UNINSTALL=1
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                die "Unknown option: $1. Use --help for usage."
                ;;
        esac
    done
}

# ─── Main ─────────────────────────────────────────────────────────────

main() {
    parse_args "$@"

    if [[ "$LIST" -eq 1 ]]; then
        show_list
        exit 0
    fi

    # Resolve target directory
    TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd)" || die "Target directory does not exist."

    # Discover skills
    discover_skills

    # Resolve agent list
    local agents_to_run=()
    if [[ -n "$AGENT" ]]; then
        # Split comma-separated agent names
        IFS=',' read -ra agents_to_run <<< "$AGENT"
        # Validate each agent
        for a in "${agents_to_run[@]}"; do
            # Trim whitespace
            a="${a#"${a%%[![:space:]]*}"}"
            a="${a%"${a##*[![:space:]]}"}"
            # shellcheck disable=SC2076
            if [[ ! " $ALL_AGENTS " =~ " $a " ]]; then
                die "Unknown agent \"$a\". Available: $ALL_AGENTS"
            fi
        done
    else
        # Default to all agents
        read -ra agents_to_run <<< "$ALL_AGENTS"
    fi

    # Header
    local action="Installing"
    local direction="to"
    if [[ "$UNINSTALL" -eq 1 ]]; then
        action="Uninstalling"
        direction="from"
    fi

    echo ""
    echo "$action ${#SKILL_NAMES[@]} skill(s) $direction ${#agents_to_run[@]} agent(s)..."
    echo "Target: $TARGET_DIR"
    echo ""

    # Run install/uninstall for each agent
    for a in "${agents_to_run[@]}"; do
        # Trim whitespace
        a="${a#"${a%%[![:space:]]*}"}"
        a="${a%"${a##*[![:space:]]}"}"

        # Look up display name
        local display_name
        case "$a" in
            claude-code) display_name="Claude Code" ;;
            cursor)      display_name="Cursor" ;;
            windsurf)    display_name="Windsurf" ;;
            copilot)     display_name="GitHub Copilot" ;;
            cline)       display_name="Cline" ;;
            codex)       display_name="OpenAI Codex" ;;
            gemini)      display_name="Gemini CLI" ;;
            *)           display_name="$a" ;;
        esac

        echo "[$display_name]"
        install_agent "$a"
        echo ""
    done

    if [[ "$DRY_RUN" -eq 1 ]]; then
        echo "(dry-run — no files were changed)"
    fi

    echo "Done!"
}

main "$@"
