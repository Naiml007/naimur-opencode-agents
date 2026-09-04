---
name: unity-cli-helper
description: 'Provides accurate Unity CLI commands for managing editors, modules, projects, licenses, and diagnostics based on official syntax rules. Trigger this skill whenever the user asks how to install, configure, or run Unity via the command line interface.'
---

# Unity CLI Helper

## When to Use
- The user asks how to install, update, remove, or manage Unity editors from the command line.
- The user needs Unity CLI commands for modules, projects, licensing, cloud, diagnostics, or AI/MCP features.
- The user wants a command for CI, automation, or non-interactive terminal use.

## Core Command Rules

### 1. CLI Lifecycle & Help
- Upgrade the CLI: `unity upgrade`
- Uninstall the CLI: `unity self-uninstall`
- Get help: `unity <command> --help` or `unity <command> <subcommand> --help`

### 2. Editor Installation & Management
- Install an editor: `unity install [version] [options]`
- Version aliases may be `latest`, `lts`, `default`, or major/minor streams such as `6` or `2022`.
- Use `-c, --changeset <hash>` when the requested version is not in the standard release list.
- Use `-m, --module <id>` one or more times or as a space-separated list for multiple modules.
- Use `--cm` or `--childModules` to install child modules automatically.
- Use `-a, --architecture <arch>` on macOS only with `arm64` or `x86_64`.
- Install modules for an existing editor: `unity install-modules [options]`
- Uninstall an editor: `unity uninstall <version>`
- List or manage editors: `unity editors [options]`
- Add a local editor path: `unity editors add <path...>`
- Set or get the default editor: `unity editors default [version]`

### 3. Workspace & Projects
- Manage projects with `unity projects` (alias `p`).
- Open a project with `unity open`.
- Work with templates with `unity templates` (alias `t`).
- Build projects with `unity build`.
- Run projects with `unity run`.
- Run tests with `unity test`.

### 4. Accounts, Licensing & Cloud
- Authenticate with `unity auth` (alias `a`).
- Manage licenses with `unity license`.
- Inspect cloud state with `unity cloud`.

### 5. Connected Editors & AI Agents
- Forward commands to a connected editor with `unity command` (alias `cmd`).
- Start an MCP server with `unity mcp`.
- Check live state with `unity status`.

### 6. Diagnostics & Configuration
- Run diagnostics with `unity doctor`.
- Read CLI logs with `unity logs`.
- Show or change editor download directories with `unity install-path`.

## Response Style
1. Start with the exact command the user needs.
2. Put the command in a fenced code block.
3. Explain the flags that matter for the task.
4. Warn that CI and non-interactive terminals may fail if `[version]` is omitted.
5. If a requested niche flag is not in this schema, advise the user to run `unity <command> --help` to confirm the locally installed CLI syntax.

## Procedure
1. Identify the task category: install, modules, editors, projects, auth, licenses, cloud, diagnostics, or AI/MCP.
2. Choose the most specific command that matches the request.
3. Include the required version or path when the command needs it.
4. Add the relevant flags for modules, architecture, child modules, or automation.
5. Mention the CI warning when appropriate.
6. If the flag is not covered by the provided rules, fall back to `--help` for the installed version.

## Example Patterns
- Install the latest editor:
  ```bash
  unity install latest
  ```
- Install a specific editor with Android and iOS modules:
  ```bash
  unity install 2022.3.0f1 -m android -m ios
  ```
- Install modules for an existing editor:
  ```bash
  unity install-modules -e 2022.3.0f1 -m android --cm
  ```
- List installed editors:
  ```bash
  unity editors --installed
  ```
