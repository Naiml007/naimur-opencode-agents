# GitHub Project Docs Automation

[![Documentation](https://img.shields.io/badge/Docs-Mintlify-blue?style=for-the-badge)](https://dis-1abe53be.mintlify.site/)

The included GitHub Actions workflow creates a Markdown document describing every tracked file in the repository and commits it as `PROJECT_DOCUMENTATION.md`.

## Usage

```powershell
node bin/github-project-docs.js --repo OWNER/REPOSITORY
```

For automation, copy `.github/workflows/project-documentation.yml` into the target repository. It runs after pushes to the default branch and can also be started from the Actions tab with **Run workflow**.

The default output is `PROJECT_DOCUMENTATION.md` in the current directory. Useful options:

```powershell
node bin/github-project-docs.js --repo OWNER/REPOSITORY --ref main --output docs/project.md
node bin/github-project-docs.js --repo OWNER/REPOSITORY --include-source --max-source-lines 120
```

The generated document contains repository metadata, a searchable file index, language and size information, a purpose note for each file, GitHub links, and optional source excerpts. Purpose notes are conservative filename and header-based summaries; semantic explanations require human review for accuracy.

Requirements: Node.js 18+ and GitHub CLI (`gh`) authenticated with access to the target repository.
