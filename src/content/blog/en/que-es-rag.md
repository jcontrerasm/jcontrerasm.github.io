---
title: "RAG from Scratch: Vectors, Embeddings and Vector Databases"
description: "My notes on how RAG works: what a vector database is, what embeddings are, and how a query flows from the user all the way to the LLM's answer."
pubDate: 2026-11-13
lang: en
tags: ["AI", "RAG", "LLM"]
---

RAG (*Retrieval-Augmented Generation*) is one of the most widely used techniques for getting an LLM to answer with your own information —internal documents, manuals, policies— without retraining it. To really understand it you have to start with its building blocks: vectors, embeddings and vector databases. This article collects my notes on each of them.

## What is a vector database?

A vector database **turns information into numeric vectors inside a multidimensional space**, which enables searches based on **similarity and meaning**, not just exact text matches.

Each stored item is a list of numbers, and each number holds a position:

```text
[-0.12300456, 0.24304689, -0.15327687, 0.58767916, ...]
```

That list is the item's "position" in the space. It lets us compare **how close two meanings are**: if two vectors are near each other, their content is similar.

### A quick refresher: what is a vector?

A **vector** is an ordered list of numbers that has **direction** and **magnitude**:

- **Direction** tells you where it points.
- **Magnitude** tells you how strong or important that direction is.

In a three-dimensional space (x, y, z), the vector `[3, 2, 1]` points to a specific spot, and each axis is one dimension.

In AI the idea is the same, just at a different scale: models can work with **hundreds or thousands of dimensions**, and each one represents a different trait of the content, such as tone, context or topic.

### From unstructured data to vectors

The general path looks like this:

```mermaid
flowchart LR
    A["Text · Image<br/>Audio · Video<br/><i>Unstructured data</i>"]
    B["LLM<br/><i>Turned into embeddings</i>"]
    C["[0 1 … 0]<br/>[1 0 … 0]<br/>[1 1 … 1]<br/><i>Vector data</i>"]
    D[("Vector database<br/><i>Storage</i>")]
    A --> B --> C --> D
```

## What are embeddings?

An embedding **is a vector, but instead of measuring, it learns meaning**: it turns ideas, text or images into numbers that capture what they mean. If I had to sum it up in one line:

> An embedding is a **vector with meaning**.

### Ingestion process

Before you can search, you need to load the information. The process has five steps:

```mermaid
flowchart LR
    A["<b>1. Raw data</b><br/>Text<br/>Image / video<br/>Documents"]
    B["<b>2. Preprocessing</b><br/>Strips unnecessary data:<br/>line breaks, spaces,<br/>emojis"]
    C["<b>3. Embedding model</b><br/>Translates the items<br/>into a list of numbers"]
    D["<b>4. Resulting vector</b><br/>List of vectors<br/>(vector embeddings)"]
    E[("<b>5. Storage</b><br/>Vector database")]
    A --> B --> C --> D --> E
```

1. **Raw data:** text, images, videos or documents.
2. **Preprocessing:** strip unnecessary data such as line breaks, extra spaces or emojis.
3. **Embedding model:** translates each item into a list of numbers.
4. **Resulting vector:** you get the list of vectors (the *vector embeddings*).
5. **Storage:** the vectors are saved in the vector database.

### Technical flow

In practice, a large document isn't turned into a single vector. It's first **split into fragments** (*chunks*), and each chunk goes through the embedding model:

```mermaid
flowchart LR
    PDF["📄 PDF<br/><i>Document</i>"]
    subgraph S["Chunking"]
        C1[chunk]
        C2[chunk]
        C3[chunk]
    end
    subgraph M["Embedding model"]
        E1[embed]
        E2[embed]
        E3[embed]
    end
    subgraph DB["Vector database"]
        V1["[0.51, 0.30, 0.51]"]
        V2["[0.43, 0.32, 0.37]"]
        V3["[0.12, 0.47, 0.28]"]
    end
    PDF --> C1 --> E1 --> V1
    PDF --> C2 --> E2 --> V2
    PDF --> C3 --> E3 --> V3
```

## Query flow

Once the information is stored, this is how a question gets answered:

```mermaid
sequenceDiagram
    actor U as User
    participant E as Embedding model
    participant DB as Vector database
    participant L as LLM
    U->>E: 1. "I want a programming course"
    E->>DB: 2. Query as an embedding [0.54, 0.32, 0.12]
    Note over DB: 3. Compares the query vector<br/>with the stored embeddings
    DB->>L: 4. Most similar vector [0.51, 0.30, 0.51]
    Note over L: 5. Analyzes and generates an answer
    L->>U: 6. Answer to the user
```

1. The **user** asks something, for example: *"I want a programming course"*.
2. The query **is turned into an embedding** with the same model: `[0.54, 0.32, 0.12]`.
3. The query vector is **compared** with the embeddings stored in the vector database.
4. The **most similar vector** is picked, for example `[0.51, 0.30, 0.51]`.
5. The **LLM** analyzes that content and generates an answer.
6. The **answer** reaches the user.

## The full RAG model

Putting it all together, RAG breaks down into the three stages that give it its name:

```mermaid
flowchart LR
    PDF["📄 PDF"] --> CH[Chunks]
    U(["👤 User"]) --> Q[Query]
    subgraph R["Retrieval"]
        EM["Embedding model"] --> DB[("Vector<br/>database")]
    end
    CH --> EM
    Q --> EM
    DB --> RES[Result]
    subgraph A["Augmented · context enrichment"]
        CTX[Context] --> PT["Prompt template"]
    end
    RES --> CTX
    Q --> PT
    subgraph G["Generation · answer generation"]
        LLM[LLM]
    end
    PT --> LLM
    LLM --> ANS[Answer] --> U
```

- **Retrieval:** the query is turned into an embedding and the most similar chunks are looked up in the vector database.
- **Augmented (context enrichment):** those chunks are inserted as context into a prompt template, alongside the original question.
- **Generation:** the LLM answers using that enriched context.

## Two key concepts

```mermaid
flowchart TD
    BD[("Vector database")]
    BD --> IDX["Indexing<br/><i>organizes the embeddings</i>"]
    BD --> SIM["Similarity measures<br/><i>quantify how alike they are</i>"]
    IDX --> KNN["KNN<br/>nearest neighbors"]
    IDX --> ANN["ANN<br/>prioritizes speed"]
    SIM --> COS["Cosine"]
    SIM --> L2["L2 norm"]
    SIM --> DOT["Dot product"]
```

### Indexing

Indexing **organizes the embeddings** so search stays efficient. It relies on algorithms such as:

- **KNN** (*k-nearest neighbors*): finds the closest neighbors exactly.
- **ANN** (*approximate nearest neighbors*): trades a bit of accuracy to **prioritize speed**, which is essential once you have millions of vectors.

### Similarity measures

They let you **quantify how alike two vectors are**. The most common ones are:

- **Cosine similarity:** compares the angle between vectors, that is, their direction.
- **L2 norm:** measures the Euclidean distance between them.
- **Dot product:** combines direction and magnitude.

## Conclusion

RAG isn't magic: it's a vector database that finds the content whose meaning is closest to the question, and an LLM that writes the answer using that content as context. Understanding vectors and embeddings is what lets you make good decisions when implementing it: how to chunk your documents, which embedding model to use and which similarity measure to choose.
