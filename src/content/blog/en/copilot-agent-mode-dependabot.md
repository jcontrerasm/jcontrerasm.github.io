---
title: "Mass-Remediating Vulnerabilities with GitHub Copilot Agent Mode"
description: "How we went from hiring developers to fix vulnerabilities one by one to org-wide, AI-agent-driven remediation at scale."
pubDate: 2026-07-14
lang: en
status: draft
tags: ["AI", "DevSecOps", "Dependabot"]
---

A few months ago we kicked off a mission: cut down the time it takes to remediate the vulnerabilities Dependabot flags across every repository in the organization.

## The original plan

Our first plan was to hire a group of developers dedicated to mitigating vulnerabilities repo by repo. It worked, but it didn't scale at the pace we needed.

## The turning point

Along the way we found that GitHub Copilot's agent mode could speed up that work. A single developer, using Copilot in agent mode from their IDE, moved much faster than remediating manually. The hiring plan shrank as a result.

But we needed to go further. The answer was using GitHub Copilot's **organization-level custom agents**, straight from the portal. That let us trigger remediations in bulk, in parallel, instead of one repository at a time.

## A shift in the developer's role

This use case points to something bigger: today the developer no longer writes the fix from scratch — they **evaluate what the AI is proposing**. That shift has meaningfully sped things up and is having a real impact across the organization.

## Sharing what we learned

A few days ago this use case was shared with GitHub, who invited us to present it at a Credicorp event held at Microsoft's offices. It was an honor to share this experience — and the stage with GitHub's Mabel Gerónimo — so the approach could be replicated across other companies in the group.
