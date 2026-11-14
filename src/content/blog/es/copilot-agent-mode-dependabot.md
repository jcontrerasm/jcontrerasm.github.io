---
title: "Remediando vulnerabilidades a escala con GitHub Copilot en modo agente"
description: "Cómo pasamos de contratar desarrolladores para remediar vulnerabilidades una por una a una remediación masiva impulsada por agentes de IA a nivel de organización."
pubDate: 2026-07-14
lang: es
status: draft
tags: ["IA", "DevSecOps", "Dependabot"]
---

Hace unos meses iniciamos una misión: optimizar los tiempos de remediación de las vulnerabilidades que Dependabot detecta en todos los repositorios de la organización.

## El plan inicial

El primer plan fue contratar a un grupo de desarrolladores dedicados a mitigar vulnerabilidades repositorio por repositorio. Funcionaba, pero no escalaba al ritmo que necesitábamos.

## El punto de inflexión

En el camino descubrimos que GitHub Copilot en modo agente podía acelerar ese trabajo. Un solo desarrollador, usando Copilot en modo agente desde su IDE, avanzaba mucho más rápido que remediando manualmente. El plan de contratación se redujo.

Pero necesitábamos ir más allá. La solución fue usar los **agentes personalizados a nivel de organización** de GitHub Copilot, directamente desde el portal. Esto nos permitió accionar remediaciones de forma masiva, en paralelo, en lugar de repositorio por repositorio.

## El cambio de rol del desarrollador

Este caso de uso muestra algo más amplio: hoy el desarrollador ya no codifica la solución desde cero, sino que **evalúa el resultado que la IA está proponiendo**. Ese cambio de rol ha optimizado muchísimo los tiempos y está generando un impacto significativo en la organización.

## Compartiendo el aprendizaje

Hace unos días este caso de uso fue compartido con GitHub, quienes nos invitaron a presentarlo en un evento de Credicorp realizado en las oficinas de Microsoft. Fue un honor compartir esta experiencia — y el escenario con Mabel Gerónimo de GitHub — para que el enfoque pueda replicarse en otras compañías del grupo.
