---
title: "Copilot Fusion (Part 2): How to Set It as the Default in Your Organization"
description: "A hands-on guide for admins: which models Fusion can use, how to make it the default model with enterprise managed settings, and which client versions you need."
pubDate: 2026-11-23
lang: en
status: published
series:
  id: copilot-fusion
  name: "Copilot Fusion"
  part: 2
tags: ["AI", "GitHub Copilot", "DevSecOps"]
---

![Copilot Fusion configuration illustration: AI controls, enterprise managed settings, teams and clients](/images/blog/copilot-fusion-configuracion/portada.png)

In [part one](/en/blog/copilot-fusion/) I covered what Copilot Fusion is and why, for those of us leading AI in the SDLC, the focus shifts from picking a model to governing a pool of models. This part gets practical: how to set Fusion as the default across the organization.

Enterprise admins set it up in two steps: which models Fusion can use, and which model and effort level every new conversation starts with.

## 1. Choose the models Fusion can use

From your enterprise settings on GitHub:

1. At the top of the page, click **AI controls**.
2. In the sidebar, click **Copilot**.
3. Under **Models**, click **Configure Copilot Fusion models**.
4. Set a status for each model in the list.

![Models section in GitHub AI controls, with the Configure Copilot Fusion models option at the bottom of the list](/images/blog/copilot-fusion-configuracion/fusion-models-seccion.png)

On the Fusion screen, each model shows its status in the **Copilot Fusion choice** column. Models marked **Required for Copilot Fusion Max** are the ones the Max level needs: if you disable any of them, GitHub shows a warning and Fusion Max becomes unavailable for the whole enterprise.

![Configure Copilot Fusion models screen with the list of models, their provider, their status and the warning that Fusion Max will be unavailable](/images/blog/copilot-fusion-configuracion/fusion-models-lista.png)

This control lets you disable a model for Fusion only, without taking it away from everyone else. A model enabled here is only used if the enterprise's other model policies also allow it, so this is the place to align the pool with security and data approvals.

## 2. Set Fusion as the default model with enterprise managed settings

With *enterprise managed settings*, Fusion becomes the default model for new conversations. There are two keys:

- `model`: sets the default model for new conversations.
- `fusionTier`: sets the default effort level when the model is `fusion`. It accepts `"standard"`, `"high"`, `"max"` or `"unmanaged"`.

This is the configuration I recommend to start with: Fusion by default, at Standard, letting a team set a different level when its work needs it.

```json
{
  "model": "fusion",
  "fusionTier": { "overridable": "standard" }
}
```

If a team needs a different default (for example, a platform team working on large multi-repo changes), it can override it in its team settings file:

```json
{
  "fusionTier": "high"
}
```

If the team doesn't set `fusionTier`, the enterprise value applies. It's worth being clear about who can change the level. With any value other than `"unmanaged"`, neither users nor repositories can change it: the decision stays with the enterprise and its teams. With `overridable`, each team can set its own level in its file; with a plain value, the level is fixed for everyone. If you don't set `fusionTier`, each person picks the level from the picker, as the screenshot in section 3 shows.

## 3. Minimum client versions

These settings require recent client versions:

| Client | Minimum version |
| --- | --- |
| VS Code | 1.144.0 |
| Copilot CLI | 1.0.104-3 |
| GitHub Copilot app | 1.1.33-4 |

For developers, the change shows up in the model picker: **Copilot Fusion** appears with its levels **Fusion Standard**, **Fusion High** and **Fusion Max**. Without enterprise configuration, anyone can still pick it manually from that same picker.

In VS Code chat, opening the picker shows the **Copilot Fusion** panel with a notice that the organization set it as the default model and, below it, the **Effort Level** option to choose the level.

What you see in that picker depends on the models you enabled in step 1:

- **Max** is the only level with required models, the ones marked **Required for Copilot Fusion Max**. If you disable any of them, the **Max** option appears grayed out, as in this screenshot.
- **Standard** and **High** don't depend on models marked as required, so they stay available even when Max isn't.
- If none of the models Fusion uses are available, **Copilot Fusion** disappears from the picker entirely.

![Copilot Fusion panel in VS Code chat, with the notice that the organization set it as the default and the Effort Level selector with Standard selected and Max grayed out](/images/blog/copilot-fusion-configuracion/fusion-models-effort-level.png)

> The full guide to creating the settings file is in GitHub's [enterprise managed settings](https://docs.github.com/copilot/reference/enterprise-administrators/enterprise-managed-settings) documentation.

## Conclusions

Setting Fusion as the default is a short configuration, but it has governance implications: the allowed model pool becomes a security control, and the default effort level becomes a cost lever. My advice is to start with Standard, let each team justify a higher level, and treat this settings file like any other infrastructure change: versioned, reviewed and measured. And once the file exists, it's worth using for more than Fusion: agent permissions, MCP servers, plugins and telemetry can all be governed from the same place. I'll cover that in detail in an upcoming article.

Thank you for your time, and I hope this article was helpful.

**Sources:** [GitHub docs on Copilot Fusion](https://docs.github.com/copilot/concepts/models/copilot-fusion), [enterprise managed settings](https://docs.github.com/copilot/reference/enterprise-administrators/enterprise-managed-settings), [getting started with managed settings](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started).
