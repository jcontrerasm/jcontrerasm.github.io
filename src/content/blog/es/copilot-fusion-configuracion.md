---
title: "Copilot Fusion (parte 2): cómo configurarlo por defecto en tu organización"
description: "Guía práctica para administradores: qué modelos puede usar Fusion, cómo dejarlo como modelo por defecto con enterprise managed settings y qué versiones de cliente necesitas."
pubDate: 2026-11-20
lang: es
status: draft
series:
  id: copilot-fusion
  name: "Copilot Fusion"
  part: 2
tags: ["IA", "GitHub Copilot", "DevSecOps"]
---

![Ilustración de la configuración de Copilot Fusion: AI controls, enterprise managed settings, equipos y clientes](/images/blog/copilot-fusion-configuracion/portada.png)

En la [primera parte](/es/blog/copilot-fusion/) conté qué es Copilot Fusion y por qué, para quienes lideramos la IA en el SDLC, el foco pasa de elegir un modelo a gobernar un pool de modelos. En esta parte voy a lo práctico: cómo dejar Fusion configurado por defecto en la organización.

La configuración la definen los administradores de la empresa en dos pasos: qué modelos puede usar Fusion y qué modelo y nivel de esfuerzo arrancan en cada conversación nueva.

## 1. Elegir los modelos que Fusion puede usar

Desde la configuración de la empresa en GitHub:

1. En la parte superior de la página, haz clic en **AI controls**.
2. En la barra lateral, haz clic en **Copilot**.
3. En la sección **Models**, haz clic en **Configure Copilot Fusion models**.
4. Define el estado de cada modelo de la lista.

Este control permite deshabilitar un modelo solo para Fusion, sin quitárselo al resto de los usuarios. Un modelo habilitado aquí solo se usa si las demás políticas de modelos de la empresa también lo permiten, así que este es el lugar para alinear el pool con las aprobaciones de seguridad y datos.

## 2. Definir Fusion como modelo por defecto con enterprise managed settings

Con los *enterprise managed settings*, Fusion queda como modelo por defecto para las conversaciones nuevas. Hay dos claves:

- `model`: define el modelo por defecto de las conversaciones nuevas.
- `fusionTier`: define el nivel de esfuerzo por defecto cuando el modelo es `fusion`. Acepta `"standard"`, `"high"`, `"max"` o `"unmanaged"`.

Esta es la configuración que recomiendo para empezar: Fusion por defecto, en Standard, permitiendo que cada persona suba el nivel cuando la tarea lo necesite.

```json
{
  "model": "fusion",
  "fusionTier": { "overridable": "standard" }
}
```

Si un equipo necesita otro nivel por defecto (por ejemplo, un equipo de plataforma que trabaja con cambios grandes en varios repositorios), puede sobrescribirlo en el archivo de configuración de su equipo:

```json
{
  "fusionTier": "high"
}
```

Si el equipo no define `fusionTier`, se aplica el valor de la empresa. Según la documentación, cualquier valor distinto de `"unmanaged"` restringe el nivel frente a cambios de usuarios y repositorios. Antes de desplegarlo, prueba en un equipo piloto si las personas pueden cambiar el nivel desde el selector, para confirmar que obtienes el comportamiento que buscas.

## 3. Versiones mínimas de los clientes

Estas configuraciones requieren versiones recientes de los clientes:

| Cliente | Versión mínima |
| --- | --- |
| VS Code | 1.144.0 |
| Copilot CLI | 1.0.104-3 |
| App de GitHub Copilot | 1.1.33-4 |

Para el desarrollador, el cambio se ve en el selector de modelos: aparece **Copilot Fusion** con sus niveles **Fusion Standard**, **Fusion High** y **Fusion Max**. Sin configuración de la empresa, cada persona puede elegirlo manualmente desde ese mismo selector.

> La guía completa para crear el archivo de configuración está en la documentación de [enterprise managed settings](https://docs.github.com/copilot/reference/enterprise-administrators/enterprise-managed-settings) de GitHub.

## Conclusiones

Dejar Fusion por defecto es una configuración corta, pero tiene implicancias de gobierno: el pool de modelos permitido se convierte en un control de seguridad, y el nivel de esfuerzo por defecto se convierte en una palanca de costos. Mi recomendación es empezar con Standard, dejar que cada equipo justifique un nivel mayor y tratar este archivo de configuración como cualquier otro cambio de infraestructura: versionado, revisado y medido.

Muchas gracias por el tiempo y espero que este artículo haya sido de ayuda.

**Fuentes:** [documentación de GitHub sobre Copilot Fusion](https://docs.github.com/copilot/concepts/models/copilot-fusion), [enterprise managed settings](https://docs.github.com/copilot/reference/enterprise-administrators/enterprise-managed-settings).
