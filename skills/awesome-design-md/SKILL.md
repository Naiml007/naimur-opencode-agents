---
name: awesome-design-md
description: 'Use curated DESIGN.md design systems from awesome-design-md to match a brand, product, or website style. Use this when the user wants a UI to feel like a specific company, wants a design reference, or needs a real-world design system prompt for an AI coding agent.'
---

# Awesome DESIGN.md

Use this skill when the user wants to match an existing brand or design language using a curated DESIGN.md reference from the awesome-design-md collection.

## What this repo is

This repository is a curated list of real-world DESIGN.md files extracted from public websites. Each file captures a brand's visual system: color palette, typography, spacing, components, layout patterns, and agent prompts that can guide UI generation.

The purpose is not to copy a company logo or proprietary identity blindly. It is to use publicly documented design language patterns as a reference for a UI that feels aligned with a brand or category.

## When to use it

Use this skill for requests such as:

- "Make this app feel like Stripe"
- "Create a UI inspired by Apple or Linear"
- "Use a dark, code-editor-inspired aesthetic"
- "Build a landing page with a premium fintech look"
- "Find a DESIGN.md reference for a SaaS brand"
- "Generate a page using a specific existing design system"
- "Give me a visual direction based on an actual brand"

## Workflow

1. Identify the target style or brand reference.
2. Match the request to the closest category in the awesome-design-md collection.
3. Pick the most relevant example from a similar product category or aesthetic.
4. Explain that the selected DESIGN.md should be copied into the project root and used as a prompt for the AI agent.
5. If the user does not specify a brand, suggest a few category-appropriate options.

## Best practice

If the user wants a specific style, cite the site and the strongest design cues, for example:

- dark, high-contrast, developer-focused
- warm minimalism and serif headings
- premium white space and product photography
- green-accented dashboards
- bold black-and-white, editorial layouts

## Examples of strong references

Common collections include:

- AI & LLM platforms: Claude, OpenCode AI, Cursor, Vercel, Anthropic-inspired product styles
- Developer tools: Linear, Raycast, Warp, Stripe, Notion
- SaaS and productivity: Intercom, Notion, Linear, Mintlify, Superhuman
- Fintech: Stripe, Coinbase, Revolut, Wise
- Media and consumer tech: Apple, Spotify, Uber, Tesla, Nintendo, BMW

## How to respond

When the user asks for a visual direction, answer with:

1. A recommended brand reference from the collection
2. The key visual cues that make it fit
3. A short prompt they can give an AI coding agent
4. A note that the DESIGN.md file should be placed in the project root and used as the source of truth

## Suggested prompt template

"Use the design system in the selected DESIGN.md as the visual source of truth. Match the mood, palette, type scale, spacing, and component language while keeping the product structure and UX for my app." 

## Guardrails

- Do not claim ownership of a brand's identity or proprietary assets.
- Treat DESIGN.md files as references for visual direction, not exact legal or branding replicas.
- Prefer references from the curated list and explain the style cues rather than dumping a raw file.
- If the user needs a brand match but no exact site is specified, suggest a few curated options instead of guessing.

## Useful repository context

The public collection is hosted at:

- https://github.com/voltagent/awesome-design-md
- https://getdesign.md/

This repository is useful for finding ready-to-use DESIGN.md references and understanding the structure of design-system prompts for AI coding agents.
