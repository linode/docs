---
slug: quantization-running-large-models-on-limited-hardware
title: "Quantization: Running Large Models on Limited Hardware"
description: "Need to run large language models (LLMs) on limited hardware? This guide explains how quantization shrinks LLMs, details the precision/format tradeoffs, and boosts inference speed."
og_description: "Need to run large language models (LLMs) on limited hardware? This guide explains how quantization shrinks LLMs, details the precision/format tradeoffs, and boosts inference speed."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-05-08
keywords: ['quantization', 'large language models', 'llm deployment', 'gpu memory', 'vram', 'gptq', 'awq', 'gguf', 'int4', 'post-training quantization']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Open-weight large language models (LLMs) are growing faster than the GPU memory available to run them. For example, Llama 3 70B in its default precision needs roughly 140 GB of VRAM just to hold the weights. This puts it well outside the reach of a single consumer GPU and even most mid-tier cloud instances. Even an 8B model requires at least 16 GB of VRAM before you can process a single token.

Quantization is the main technique developers use to bring these models within reach. It shrinks models by storing their weights with fewer bits per number, turning a model that might have required four high-end GPUs into one that fits on a single GPU. The tradeoff is a slight reduction in output quality; for most applications, that tradeoff is worth it.

Before developers can decide how to deploy a quantized model, they need a working understanding of what quantization actually does, how quality and efficiency scale against each other, and where the practical tradeoffs lie. That foundation carries through to downstream decisions about inference, fine-tuning, and deployment.

## What quantization does

A neural network is a collection of numbers called **weights**, which are learned during training. You'll often see these referred to as **parameters**. When a model is described as having 70 billion parameters, it's mostly referring to the number of weights. An LLM's behavior is entirely determined by those weights, and the model's memory footprint is mostly the cost of storing them.

**Quantization replaces those high-precision numbers with lower-precision ones.** Instead of a 16-bit float per weight, you might store an 8-bit integer (with 256 possible values) or a 4-bit integer (with 16 possible values). Each weight gets snapped to the closest value the lower-precision format can represent. This works because neural networks are surprisingly tolerant of rounding: small errors in individual weights tend to average out across billions of values, and the model's output usually stays close to what it would have been at full precision.

Most quantization happens after training is finished, in a process called post-training quantization (PTQ). The model trains in full precision, then its weights are converted down to a lower-precision format for deployment. An alternative method, quantization-aware training (QAT), bakes low precision into the training process itself so the model learns to tolerate the rounding. QAT generally produces slightly better quality at aggressive bit widths but requires access to the training pipeline, so it's uncommon in the open-weight world.

Nearly every quantized open-weight model you'll encounter was produced via PTQ.

## Precision levels

Modern LLMs are typically trained in 32-bit floating point (called FP32) or a 16-bit format developed at Google Brain (called BF16). Inference on unquantized models usually runs in FP16 or BF16. The shift from training precision to inference precision isn't itself considered quantization, since it's nearly lossless and treated as standard practice. Quantization specifically refers to the further reductions in precision that occur below this 16-bit baseline, which is where the real tradeoffs between memory, speed, and quality begin.

### FP8

FP8 is an 8-bit floating point format that's become the production default on modern NVIDIA hardware. Hopper, Ada, and Blackwell GPUs include native FP8 tensor cores, making FP8 inference nearly as fast as the hardware can theoretically go. The quality loss of FP8 versus FP16 is minimal. However, the main limitation of FP8 is that it isn't available on older GPUs.

### INT8

INT8 is an 8-bit integer format that's been the go-to for broadly supported quantization for years. It runs on practically any GPU with reasonable speed. Compared with FP16, INT8 halves memory usage while losing very little quality on standard benchmarks.

### INT4

INT4 is where most local and resource-constrained deployments live today. A 4-bit weight uses a quarter of the memory of FP16, which is what lets 70B-parameter models fit on a single high-end consumer GPU. Quality loss is measurable but usually acceptable.

### Sub-4-bit

Sub-4-bit formats (3-bit, 2-bit) also exist. However, quality degrades sharply at these precisions, and they rarely make sense outside of very specific constraints.

Real quantized models typically use mixed precision internally. Sensitive layers (such as attention output projections, embeddings, and some normalization parameters) often stay at higher precision, while the bulk of the model's weights are aggressively quantized. This is how 4-bit models preserve as much quality as they do.

## Quantization formats and algorithms

The terminology used in this section can trip up a lot of developers, so it's worth being explicit:

-   GGUF is a container format
-   GPTQ and AWQ are quantization algorithms
-   bitsandbytes is a library that implements several quantization methods

These terms are not peers in the same category, even though they are often listed together.

### GGUF

[GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) is the file format used by [llama.cpp](https://github.com/ggml-org/llama.cpp) and the tools built on top of it (including Ollama and LM Studio). GGUF stores quantized weights alongside model metadata and supports a family of quantization schemes (such as `Q4_K_M`, `Q5_K_S`, `Q8_0`, and others) that trade size for quality. GGUF is designed for CPU and hybrid CPU/GPU inference with layer offloading, which makes it the standard choice for local development, edge deployment, and mixed-hardware scenarios.

### GPTQ

[GPTQ](https://github.com/ist-daslab/gptq) is a PTQ algorithm that uses a small calibration dataset to minimize quality loss at low bit widths. It typically produces 4-bit or 3-bit models with strong quality retention and has a large library of pre-quantized checkpoints on Hugging Face. The original [AutoGPTQ](https://github.com/AutoGPTQ/AutoGPTQ) toolkit was archived in April 2025 and has been succeeded by [GPTQModel](https://github.com/modelcloud/gptqmodel), which handles GPTQ alongside several related formats.

### AWQ

[Activation-aware Weight Quantization (AWQ)](https://github.com/mit-han-lab/llm-awq) takes a different approach: it identifies the small fraction of weights (roughly 1%) whose errors would have the biggest impact on the model's output, and protects them while quantizing the rest more aggressively. AWQ generally produces better quality than GPTQ at the same bit width. It has become a common default for 4-bit GPU production deployments.

### bitsandbytes

[bitsandbytes](https://github.com/bitsandbytes-foundation/bitsandbytes) is a quantization library tightly integrated with Hugging Face Transformers. It supports 8-bit and 4-bit (NF4) quantization with minimal setup, and it's the only mainstream option that supports training on top of quantized weights.

## The quality versus efficiency tradeoff

### Impact on memory and inference speed

Memory savings from quantization are predictable. Cut the bits per weight in half, and the model will use roughly half the memory. Additionally, inference speed usually improves alongside memory, because GPUs spend most of their inference time moving weights between memory and compute units; smaller weights mean less data to move. Ultimately, memory bandwidth is what bottlenecks most LLM inference, not raw compute.

### Impact on quality

Quality loss, on the other hand, does *not* follow a linear curve.

-   **Moving from FP16 to INT8 is nearly free.** The model's outputs are effectively indistinguishable from the unquantized version on standard benchmarks, and most applications cannot tell the difference at all.
-   **Moving from INT8 to INT4 results in a measurable drop**, typically a few percent in benchmarks. For general-purpose applications, this is usually acceptable, which is why 4-bit has become the practical workhorse for memory-constrained deployment.
-   **Moving below 4 bits is where things break down.** At 3-bit or 2-bit precision, models start losing coherence, making obvious mistakes, and failing on tasks they handled cleanly at 4-bit.

Each step below 4 bits still cuts memory meaningfully, but the quality losses grow disproportionately. The tradeoff stops being worth it.

### Model size is a factor

Another factor that shapes the tradeoff is model size. Larger models tolerate aggressive quantization much better than smaller ones. A 70B model quantized to 4 bits typically produces better output than a 13B model running at full FP16 precision, even though both occupy similar memory. If you have the choice between a smaller unquantized model and a larger quantized one at the same memory budget, the larger quantized model usually wins.

### Task sensitivity is a factor

Quality loss first shows up in code generation, mathematical reasoning, and long-sequence outputs, where small errors compound across many tokens. General conversation and straightforward Q&A hold up well even under aggressive quantization.

For production-bound tasks, perplexity scores provide a rough signal of quality loss. Perplexity is a standard LLM metric that measures how well a model predicts unseen text. However, task-specific benchmarks are more reliable. A model can maintain its perplexity while quietly losing ground in coding, reasoning, or instruction-following.

## Choosing a format

The right format for quantization depends on where the model runs and what hardware is available.

### Local development and workstations

For local development and workstation use, GGUF via llama.cpp or Ollama is the standard. The ecosystem is mature, the tooling handles CPU/GPU hybrid inference well, and the quantization options span a wide range of size-quality tradeoffs.

### Edge inference

Edge inference environments impose constraints that data-center GPU deployments don't face. You'll have limited VRAM per node, tight power and thermal budgets, and often single-GPU configurations. In many of these scenarios, quantization is a prerequisite. An FP16 70B model won't fit on edge hardware, but a 4-bit version often will. GGUF remains the common choice for these deployments, for the same ecosystem reasons that make it strong on workstations.

Running inference closer to users reduces round-trip latency, which matters for real-time applications. Smaller quantized models make distributed inference economically viable. Less VRAM per node means more nodes can be deployed for the same infrastructure budget, resulting in better geographic coverage and lower per-request costs.

Distributed GPU compute platforms like Akamai support this pattern across the standard inference stack.

### Production on newer GPUs

For production GPU inference on Hopper, Ada, or Blackwell GPUs with native FP8 tensor cores, FP8 is increasingly the default for quality-sensitive workloads. Native tensor core support makes it fast, and its quality holds up better than that of 4-bit alternatives.

### Production on older GPUs or constrained memory budgets

For production GPU inference on hardware without FP8 support, or when 4-bit memory budgets are required, AWQ is the common default, with GPTQ as an alternative when specific pre-quantized checkpoints or toolchains require it.

### Quality-sensitive workloads with memory to spare

For applications where quality loss is unacceptable, and memory is available, INT8 or unquantized FP16/BF16 remains the right call. Not every workload needs to be pushed to the lowest bit width.

## Summary

Quantization reduces the numerical precision of model weights to fit larger models on smaller hardware, trading a small, usually predictable loss in quality for substantial memory and speed gains. Decisions about quantization precision and format depend largely on where the model runs, what hardware is available, and how sensitive the application is to quality loss.

Quality loss at 4-bit precision has become small enough that quantized models now dominate real-world open-weight deployments. Quantization used to be an optimization step, but it's now baked into how most developers plan their deployments.