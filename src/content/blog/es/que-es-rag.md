---
title: "RAG desde cero: vectores, embeddings y bases de datos vectoriales"
description: "Mis apuntes sobre cómo funciona RAG: qué es una base de datos vectorial, qué son los embeddings y cómo fluye una consulta desde el usuario hasta la respuesta del LLM."
pubDate: 2026-11-13
lang: es
tags: ["IA", "RAG", "LLM"]
---

RAG (*Retrieval-Augmented Generation*) es una de las técnicas más usadas para que un LLM responda con información propia —documentos internos, manuales, políticas— sin tener que reentrenarlo. Para entenderlo de verdad hay que empezar por sus piezas: los vectores, los embeddings y las bases de datos vectoriales. Este artículo recoge mis apuntes sobre cada una de ellas.

## ¿Qué es una base de datos vectorial?

Una base de datos vectorial **convierte la información en vectores numéricos dentro de un espacio multidimensional**, lo que permite hacer búsquedas basadas en **similitud y significado**, no solo en coincidencias exactas de texto.

Cada elemento almacenado es una lista de números, y cada número ocupa una posición:

```text
[-0.12300456, 0.24304689, -0.15327687, 0.58767916, ...]
```

Esa lista es la "posición" del elemento dentro del espacio. Gracias a ella podemos comparar **qué tan cercanos son dos significados**: si dos vectores están cerca, su contenido se parece.

### Un repaso rápido: ¿qué es un vector?

Un **vector** es una lista ordenada de números que tiene **dirección** y **magnitud**:

- La **dirección** indica hacia dónde apunta.
- La **magnitud** nos dice qué tan fuerte o importante es esa dirección.

En un espacio de tres dimensiones (x, y, z), el vector `[3, 2, 1]` apunta a un punto concreto, y cada eje representa una dimensión.

En IA la idea es la misma, pero a otra escala: los modelos pueden trabajar con **cientos o miles de dimensiones**, y cada una representa un rasgo distinto del contenido, como el tono, el contexto o el tema.

### De datos no estructurados a vectores

El camino general es este:

```mermaid
flowchart LR
    A["Texto · Imagen<br/>Audio · Video<br/><i>Datos no estructurados</i>"]
    B["LLM<br/><i>Transformación a embeddings</i>"]
    C["[0 1 … 0]<br/>[1 0 … 0]<br/>[1 1 … 1]<br/><i>Datos vectoriales</i>"]
    D[("Base de datos vectorial<br/><i>Almacenamiento</i>")]
    A --> B --> C --> D
```

## ¿Qué son los embeddings?

Un embedding **es un vector, pero en lugar de medir, aprende significados**: convierte ideas, textos o imágenes en números que reflejan su sentido. Si tuviera que resumirlo en una frase:

> Un embedding es un **vector con significado**.

### Proceso de almacenamiento

Antes de poder buscar, hay que cargar la información. El proceso tiene cinco pasos:

```mermaid
flowchart LR
    A["<b>1. Datos crudos</b><br/>Texto<br/>Imagen / video<br/>Documentos"]
    B["<b>2. Preprocesamiento</b><br/>Elimina datos innecesarios:<br/>saltos de línea, espacios,<br/>emojis"]
    C["<b>3. Modelo de embedding</b><br/>Traduce los elementos<br/>en una lista de números"]
    D["<b>4. Vector resultante</b><br/>Lista de vectores<br/>(vector embeddings)"]
    E[("<b>5. Almacenamiento</b><br/>Base vectorial")]
    A --> B --> C --> D --> E
```

1. **Datos crudos:** texto, imágenes, videos o documentos.
2. **Preprocesamiento:** se eliminan datos innecesarios como saltos de línea, espacios extra o emojis.
3. **Modelo de embedding:** traduce cada elemento en una lista de números.
4. **Vector resultante:** obtenemos la lista de vectores (los *vector embeddings*).
5. **Almacenamiento:** los vectores se guardan en la base de datos vectorial.

### Flujo técnico

En la práctica, un documento grande no se convierte en un único vector. Primero se **segmenta en fragmentos** (*chunks*), y cada fragmento pasa por el modelo de embeddings:

```mermaid
flowchart LR
    PDF["📄 PDF<br/><i>Documento</i>"]
    subgraph S["Segmentación de fragmentos"]
        C1[chunk]
        C2[chunk]
        C3[chunk]
    end
    subgraph M["Modelo de embeddings"]
        E1[embed]
        E2[embed]
        E3[embed]
    end
    subgraph DB["Base vectorial"]
        V1["[0.51, 0.30, 0.51]"]
        V2["[0.43, 0.32, 0.37]"]
        V3["[0.12, 0.47, 0.28]"]
    end
    PDF --> C1 --> E1 --> V1
    PDF --> C2 --> E2 --> V2
    PDF --> C3 --> E3 --> V3
```

## Flujo de consulta

Con la información ya almacenada, así se resuelve una pregunta:

```mermaid
sequenceDiagram
    actor U as Usuario
    participant E as Modelo de embedding
    participant DB as Base vectorial
    participant L as LLM
    U->>E: 1. "Quiero un curso de programación"
    E->>DB: 2. Consulta como embedding [0.54, 0.32, 0.12]
    Note over DB: 3. Compara el vector de la consulta<br/>con los embeddings guardados
    DB->>L: 4. Vector más similar [0.51, 0.30, 0.51]
    Note over L: 5. Analiza y genera una respuesta
    L->>U: 6. Respuesta al usuario
```

1. El **usuario** hace una consulta, por ejemplo: *"Quiero un curso de programación"*.
2. La consulta **se convierte en un embedding** con el mismo modelo: `[0.54, 0.32, 0.12]`.
3. Se **compara** el vector de la consulta con los embeddings guardados en la base vectorial.
4. Se **escoge el vector más similar**, por ejemplo `[0.51, 0.30, 0.51]`.
5. El **LLM** analiza ese contenido y genera una respuesta.
6. La **respuesta** llega al usuario.

## El modelo RAG completo

Juntando todo, RAG se divide en las tres etapas que le dan nombre:

```mermaid
flowchart LR
    PDF["📄 PDF"] --> CH[Chunks]
    U(["👤 Usuario"]) --> Q[Query]
    subgraph R["Retrieval · recuperación"]
        EM["Modelo de embedding"] --> DB[("Base de datos<br/>vectorial")]
    end
    CH --> EM
    Q --> EM
    DB --> RES[Resultado]
    subgraph A["Augmented · enriquecimiento de contexto"]
        CTX[Contexto] --> PT["Plantilla de prompt"]
    end
    RES --> CTX
    Q --> PT
    subgraph G["Generation · generación de respuesta"]
        LLM[LLM]
    end
    PT --> LLM
    LLM --> ANS[Respuesta] --> U
```

- **Retrieval (recuperación):** la consulta se convierte en embedding y se buscan los fragmentos más parecidos en la base vectorial.
- **Augmented (enriquecimiento del contexto):** esos fragmentos se insertan como contexto en una plantilla de prompt, junto con la pregunta original.
- **Generation (generación de la respuesta):** el LLM responde usando ese contexto enriquecido.

## Dos conceptos clave

```mermaid
flowchart TD
    BD[("Base de datos vectorial")]
    BD --> IDX["Indexación<br/><i>organiza los embeddings</i>"]
    BD --> SIM["Medidas de similitud<br/><i>cuantifican qué tan parecidos son</i>"]
    IDX --> KNN["KNN<br/>vecinos más cercanos"]
    IDX --> ANN["ANN<br/>prioriza la velocidad"]
    SIM --> COS["Coseno"]
    SIM --> L2["Norma L2"]
    SIM --> DOT["Producto punto"]
```

### Indexación

La indexación **organiza los embeddings** para que la búsqueda sea eficiente. Se apoya en algoritmos como:

- **KNN** (*k-nearest neighbors*): busca los vecinos más cercanos de forma exacta.
- **ANN** (*approximate nearest neighbors*): sacrifica algo de precisión para **priorizar la velocidad**, algo indispensable cuando hay millones de vectores.

### Medidas de similitud

Permiten **cuantificar qué tan parecidos son dos vectores**. Las más comunes son:

- **Similitud coseno** (*cosine*): compara el ángulo entre los vectores, es decir, su dirección.
- **Norma L2** (*L2 norm*): mide la distancia euclidiana entre ellos.
- **Producto punto** (*dot product*): combina dirección y magnitud.

## Conclusión

RAG no es magia: es una base de datos vectorial que encuentra el contenido con el significado más cercano a la pregunta, y un LLM que redacta la respuesta con ese contenido como contexto. Entender los vectores y los embeddings es lo que permite tomar buenas decisiones al implementarlo: cómo segmentar los documentos, qué modelo de embeddings usar y qué medida de similitud elegir.
