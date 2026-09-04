---
name: customize-opencode
description: Safely create, improve, and validate OpenCode agents, skills, permissions, and configuration. Use for OpenCode setup or customization, not ordinary project code.
---

# Customize OpenCode

Use this skill only for OpenCode configuration: `opencode.json`, agent Markdown
files, skills, rules, plugins, MCP settings, and related local setup. Do not use
it for application code simply because the work is performed through OpenCode.

## Workflow

1. Inspect the current configuration and the affected agents or skills before
   proposing a change. Respect global versus project-local scope.
2. Prefer the documented OpenCode schema and current official documentation
   when syntax or behavior may have changed.
3. Keep each agent narrowly scoped: give it only the skills and permissions its
   role needs, and state when it must load a skill rather than merely listing it.
4. Preserve existing provider, model, permission, and default-agent choices
   unless the user asks to change them.
5. For skills, use a stable lowercase kebab-case directory containing
   `SKILL.md` with `name` and `description` frontmatter. Avoid duplicate skill
   IDs across discovered locations.

## Validation

- Parse JSON or JSONC after editing it.
- Check every agent Markdown frontmatter block and confirm referenced agent IDs
  exist.
- Confirm each enabled skill is discoverable from an OpenCode skill source and
  its directory name matches its skill ID.
- Report any unsupported setting, duplicate ID, or unavailable dependency
  instead of silently guessing.

## Guardrails

- Do not grant broad permissions merely to make a configuration work.
- Do not overwrite unrelated user configuration or credentials.
- Explain scope, behavior, and any restart or reload the user needs after the
  change.
