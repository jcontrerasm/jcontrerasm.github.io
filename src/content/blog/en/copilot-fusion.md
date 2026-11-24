---
title: "Copilot Fusion (Part 1): when you stop picking the model and start governing the pool"
description: "What Copilot Fusion is, how it orchestrates several models per task, and what changes for those of us leading AI adoption in the SDLC: cost, metrics and governance."
pubDate: 2026-11-20
lang: en
status: published
series:
  id: copilot-fusion
  name: "Copilot Fusion"
  part: 1
tags: ["AI", "GitHub Copilot", "DevSecOps", "Metrics"]
---

![Copilot Fusion illustration: an orchestrator routing a task to several models and returning a single answer](/images/blog/copilot-fusion/portada.png)

Over the past few months, one of the questions I've heard most from teams is: *"Which model should I use for this?"*. Every developer ended up with their own recipe: one model for everyday work, another "for when things get hard," and a pricier one saved for emergencies. For those of us leading AI adoption in the SDLC, that meant something uncomfortable: cost and quality depended on a manual decision nobody was measuring.

At GitHub Universe (October 28, 2026), GitHub introduced **Copilot Fusion**, and what makes it interesting is that it goes straight at that problem.

This article is the first of a two-part series. Here I focus on what Fusion is and what changes for those of us leading AI in the SDLC; in [part two](/en/blog/copilot-fusion-configuracion/) I walk through how to set it as the default in your organization, step by step.

## What is Copilot Fusion?

Copilot Fusion **is not a new model**. It's an orchestration engine that decides, at runtime, which model (or which combination of models) handles each task, and returns a single answer. In the words of Mario Rodriguez, GitHub's CPO: *"It's not a model. It's an orchestration engine at runtime."*

It's available on every Copilot plan, in VS Code, the GitHub Copilot app, Copilot CLI and JetBrains IDEs.

The change for developers is simple: instead of picking a model, they pick an **effort level**:

- **Standard:** versatile models for everyday work.
- **High:** more complex tasks, like hard bugs or multi-file changes.
- **Max:** favors the most capable models for the hardest problems.

## How it orchestrates models

For each prompt, Fusion picks one of three execution patterns:

- **Single:** one model answers directly.
- **Cascade:** a cheaper model drafts a solution, a "judge" evaluates it and, if it falls short, escalates to a stronger model.
- **Critique:** one model drafts, others review it, and the original model revises its draft.

```mermaid
flowchart LR
    P[Prompt + effort level] --> F{Copilot Fusion}
    F -->|Single| M1[One model]
    F -->|Cascade| C1[Cheaper model] --> J{Judge}
    J -->|Accept| R
    J -->|Escalate| C2[Stronger model]
    F -->|Critique| D[Draft] --> RV[Review by other models] --> RE[Revision]
    M1 --> R[Single answer]
    C2 --> R
    RE --> R
```

The pool includes models from different providers (Artificial Analysis reported Claude Opus 5.5, Claude Sonnet 5.5 and GPT-6 models, among others), and the models used **vary by request and by the policies the organization sets**. That last part is what matters most to me as an architect, and I'll come back to it below.

## What the numbers say (and what they don't)

Artificial Analysis's independent evaluation, published the same day as the announcement, compared Fusion at Max against Claude Code with Claude Opus 5.5 at its Max setting:

| Metric | Copilot Fusion (Max) | Claude Code + Opus 5.5 (Max) |
| --- | --- | --- |
| Coding agent index score | 60 | ~62 |
| Average cost per task | USD 5.59 | USD 11.42 |

In other words: **two points behind, at roughly half the cost per task**. Fusion led on Terminal-Bench but trailed on FrontierCode (51 vs 56).

GitHub, for its part, shared bolder figures, such as cost reductions of up to 77% in its own evaluations. My advice is to keep the two apart: the independent figure is the one I'd bring to a conversation with finance; the vendor's figure is a hypothesis to validate against our own repositories.

And there's a nuance no benchmark captures: **cost per task is not the cost of shipping software**. Human review, rework and security remediation don't show up in the table.

## What changes for those leading AI in the SDLC

From where I sit, I see three concrete impacts.

### 1. Governance moves from the model to the pool

Before, approving a model was a one-off decision. With Fusion, any model in the pool may end up processing a team's code. That means data protection, residency and compliance reviews must cover **the whole pool**, not just the "favorite" model.

The good news is that Fusion respects enterprise and organization model policies: admins can see which models are eligible, disable specific models for Fusion only, and set a default effort level. In practice, this turns the allowed-model list into one more security control in the pipeline, and as such it should be versioned, reviewed and audited.

### 2. Cost metrics become engineering metrics

Fusion carries no extra charge: each model involved is billed at its standard rate. A High or Max level may call several models within a single task, so cost per task now depends on the effort level each developer chooses.

That's why, instead of measuring only "adoption" (how many people use Copilot), it's worth starting to measure:

- **Effort level distribution** by team and task type.
- **Cost per accepted PR**, not per prompt.
- **Acceptance and rework rates** for changes generated at each level.
- **Security findings** introduced or remediated in AI-assisted changes.

If Max doesn't improve the acceptance rate over Standard for a given task type, that's an immediate saving we only see if we measure it.

### 3. The developer's role keeps shifting toward evaluation

With AI agents, developers were already shifting from writing the fix to evaluating the AI's proposal. Fusion takes that shift further: now they don't even pick the tool, only how much effort to invest.

There's one detail to keep in mind. In agent mode, Cascade's cheaper model doesn't just propose text: it actually edits files. If the judge decides that draft isn't good enough and escalates to the stronger model, Fusion stops using the draft as the answer, but **the changes it already made to the files are not rolled back**. The stronger model works on top of that already-modified code, and the final result can mix both attempts: a file nobody uses, a half-changed function, a leftover import, or debug code.

That's why reading the final answer in the chat isn't enough. Fusion decides which model does the work, but it doesn't guarantee the files end up clean. Before accepting or committing, review the full diff: that review is still the developer's responsibility.

## How I'd roll it out

If I were starting today, I'd follow these steps:

1. **Review the list of eligible models** for Fusion and align it with the organization's security and data policies.
2. **Set Fusion at Standard as the default** and keep High and Max as explicit choices. I explain how to configure it in [part two](/en/blog/copilot-fusion-configuracion/).
3. **Configure budgets and alerts** before opening it to every team.
4. **Run a pilot with baseline metrics** (cost per PR, acceptance, rework) on two or three teams.
5. **Compare against current usage** before scaling. The temporary launch discount can skew the cost picture in the first weeks.

## Conclusions

Copilot Fusion changes the question from *"which model do I use?"* to *"how much effort does this task deserve?"*. For developers it's a simplification; for those of us leading AI in the SDLC it's a shift in responsibility: we stop managing individual tools and start **governing a pool of models and measuring their real impact**.

The early numbers are promising, but the decision to scale shouldn't come from a benchmark. It should come from our own engineering metrics: cost per delivered change, quality and security. AI accelerates; culture and data decide where we're headed.

If you want to put this into practice, in [part two](/en/blog/copilot-fusion-configuracion/) I explain how to set Fusion as the default in your organization.

Thank you for your time, and I hope this article was helpful.

**Sources:** [GitHub docs](https://docs.github.com/copilot/concepts/models/copilot-fusion), [VentureBeat](https://venturebeat.com/orchestration/github-copilot-fusion-mixes-models-to-achieve-near-opus-5-5-coding-performance-at-half-the-per-task-cost) (includes Artificial Analysis data).
