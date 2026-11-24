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

This control lets you disable a model for Fusion only, without taking it away from everyone else. A model enabled here is only used if the enterprise's other model policies also allow it, so this is the place to align the pool with security and data approvals.

## 2. Set Fusion as the default model with enterprise managed settings

With *enterprise managed settings*, Fusion becomes the default model for new conversations. There are two keys:

- `model`: sets the default model for new conversations.
- `fusionTier`: sets the default effort level when the model is `fusion`. It accepts `"standard"`, `"high"`, `"max"` or `"unmanaged"`.

This is the configuration I recommend to start with: Fusion by default, at Standard, letting each person raise the level when the task needs it.

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

If the team doesn't set `fusionTier`, the enterprise value applies. According to the docs, any value other than `"unmanaged"` restricts the level against user and repository overrides. Before rolling it out, check with a pilot team whether people can change the level from the picker, to confirm you get the behavior you want.

## 3. Minimum client versions

These settings require recent client versions:

| Client | Minimum version |
| --- | --- |
| VS Code | 1.144.0 |
| Copilot CLI | 1.0.104-3 |
| GitHub Copilot app | 1.1.33-4 |

For developers, the change shows up in the model picker: **Copilot Fusion** appears with its levels **Fusion Standard**, **Fusion High** and **Fusion Max**. Without enterprise configuration, anyone can still pick it manually from that same picker.

> The full guide to creating the settings file is in GitHub's [enterprise managed settings](https://docs.github.com/copilot/reference/enterprise-administrators/enterprise-managed-settings) documentation.

## Conclusions

Setting Fusion as the default is a short configuration, but it has governance implications: the allowed model pool becomes a security control, and the default effort level becomes a cost lever. My advice is to start with Standard, let each team justify a higher level, and treat this settings file like any other infrastructure change: versioned, reviewed and measured.

Thank you for your time, and I hope this article was helpful.

**Sources:** [GitHub docs on Copilot Fusion](https://docs.github.com/copilot/concepts/models/copilot-fusion), [enterprise managed settings](https://docs.github.com/copilot/reference/enterprise-administrators/enterprise-managed-settings).
