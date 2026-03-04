---
slug: vector-db-benchmarking
title: "Guide to Vector Database Benchmarking"
description: "Adopting a vector database can be a significant investment in infrastructure costs and operational overhead"
authors:
  - Akamai
contributors:
  - Akamai
published: 2026-03-04
keywords: ['vector databases','benchmarking','approximate nearest neighbor','ANN','recall','latency','throughput','embeddings','similarity search']
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)"
---

Vector databases are becoming increasingly important for AI-powered applications, ranging from RAG systems to semantic search engines. However, adopting a vector database can be a significant investment in infrastructure costs and operational overhead. Choosing the appropriate type and instance size for a vector database is critical to both performance and cost.

Systematic benchmarking of vector databases enables an organization to make data-driven decisions based on actual workloads. Stakeholders can perform realistic cost modeling at current and projected scales. Without proper benchmarking, your team may encounter:

- Performance degrading unexpectedly once you reach production scale
- Over-provisioning out of uncertainty
- Discovering performance issues only after committing to a platform.

This guide helps you understand the basics of vector database benchmarking, specifically walking through an example benchmark result from testing an Akamai Managed PostgreSQL instance with VectorDBBench.

## Understanding VectorDatabase Benchmarks

In traditional databases, you're looking for exact matches. Either a record exists, or it doesn't. Vector databases are not like this. Vector databases are very different, as querying them is about finding approximate nearest neighbors. This fundamental difference means that every query involves a tradeoff between how fast you want results and how accurate those results need to be. How you choose and tune your vector database is driven by the quest to balance speed, accuracy, and resource costs simultaneously.

### Key Performance Metrics

When benchmarking vector databases, track metrics across the following three categories. Each metric answers a specific question about your database's capabilities.

#### Query performance

  - **Query latency (p50, p95, p99)**: Percentiles show typical (p50), common (p95), and worst-case (p99) response times
  - **Throughput (QPS)**: Measures how many searches per second your system can handle under load
  - **Recall@K**: Measures accuracy by showing what percentage of the K truly nearest neighbors were actually found

#### Resource cost metrics

  - **Memory usage**: Shows how much RAM your index needs, directly impacting instance sizing
  - **Storage requirements**: Includes both original vectors and index overhead
  - **CPU utilization**: Varies dramatically by index type and algorithm
  - **Network I/O**: Important for cloud-hosted solutions and geographically distributed queries
  - **Queries per dollar (QP$)**: Cost-efficiency metric comparing performance across different instance tiers

####  Operational metrics

  - **Insert/update performance**: Determines whether you can support real-time applications or need batch processing
  - **Concurrent query performance**: Tests how well the system scales under a realistic multi-user load
  - **Index build time**: Matters for initial setup and periodic index rebuilds
  - **Scaling behavior**: Shows how performance changes as your data grows 10x or 100x

### Tradeoffs between speed and recall

The fundamental tension in vector search is this: you can make searches faster by sacrificing accuracy, or more accurate by accepting slower performance. This isn't a limitation—it's an inherent characteristic of approximate nearest neighbor algorithms. Most production systems target 95-99% recall, finding that sweet spot where results are accurate enough for their use case while maintaining acceptable query latency. Understanding where your application falls on this spectrum is essential for proper benchmarking.

## Benchmarking`pgvector` in PostgreSQL with VectorDBBench

`pgvector` is an open-source PostgreSQL extension that adds vector similarity search to your relational database. Instead of managing a separate vector database, you store embeddings alongside traditional data and query them with SQL. It supports two index types:

1. HNSW for better query performance
2. IVFFlat for faster builds with lower memory

`pgvector` is often adopted by teams already using PostgreSQL who want to add vector search without managing separate infrastructure. Teams may also adopt it if they have applications that require vector search alongside relational queries.

[VectorDBBench](https://github.com/zilliztech/VectorDBBench) is an open-source benchmarking framework from Zilliz that provides standardized performance testing across multiple vector databases. It offers a CLI, a web-based UI, pre-configured test scenarios, support for various databases, and automatic collection of comprehensive metrics.

Using VectorDBBench ensures consistent methodology and provides industry-standard metrics. This makes results easily shareable and comparable.

## Running Benchmarks and Interpreting Results

VectorDBBench supports benchmarking across vector databases, including Milvus, Pinecone, and `pgvector`. For a complete list of supported database clients, see the [VectorDBBench README](https://github.com/zilliztech/VectorDBBench).

This guide focuses on `pgvector` in PostgreSQL to demonstrate a practical benchmarking example. The concepts and interpretation techniques apply broadly to other vector databases as well.

For complete setup instructions on provisioning resources, installing dependencies, and running VectorDBBench with `pgvector` on Akamai Managed PostgreSQL, see "How to Set Up VectorDBBench to Benchmark Akamai Managed PostgreSQL."

### Benchmark parameters for `pgvector`

When running VectorDBBench with `pgvector`, you can configure parameters across several categories, including the following:

#### Dataset configuration

  - `--case-type`: Predefined test cases (For example: `Performance1536D50K` for 50K vectors at 1536 dimensions)
  - `--k`: Number of nearest neighbors to return (Default: 100)
  - Custom dataset options: `--custom-dataset-name`, `--custom-dataset-size`, `--custom-dataset-dim`

#### HNSW index parameters

  - `--m`: Number of connections per node in the HNSW graph. This affects index size and search quality.
  - `--ef-construction`: Candidates considered during index building. A higher number yields better quality but a slower build.
  - `--ef-search`: Candidates considered during search. A higher number yields better recall, but slower queries.

#### Concurrency testing

  - `--maintenance-work-mem`: Memory allocated for index creation operations
  - `--max-parallel-workers`: Number of parallel processes for index creation

#### Test execution control

  - `--drop-old / --skip-drop-old`: Whether to drop existing data before testing
  - `--load / --skip-load`: Whether to load data (useful for re-testing existing data)
  - `--search-serial / --skip-search-serial`: Enable/disable serial search testing
  - `--search-concurrent / --skip-search-concurrent`: Enable/disable concurrent search testing

#### Interpreting your results

To better understand how to interpret the data, consider the following example of a real benchmark results JSON file.

```json {title="Example JSON file with results from a VectorDBBench run"}
{
  "run_id": "32143a10abef4c9abc1b625e771ef581",
  "task_label": "32143a10abef4c9abc1b625e771ef581",
  "results": [
    {
      "metrics": {
        "max_load_count": 0,
        "insert_duration": 10.1447,
        "optimize_duration": 70.0666,
        "load_duration": 80.2113,
        "qps": 542.8612,
        "serial_latency_p99": 0.0072,
        "serial_latency_p95": 0.0053,
        "recall": 0.9704,
        "ndcg": 0.9758,
        "conc_num_list": [
          1,
          5,
          10,
          20,
          30,
          40,
          60,
          80
        ],
        "conc_qps_list": [
          217.7906,
          533.9531,
          534.8679,
          542.8612,
          523.398,
          519.0258,
          505.6169,
          502.7718
        ],
        "conc_latency_p99_list": [
          0.008155493999993262,
          0.021081581450016502,
          0.03925018654992982,
          0.07296883467007315,
          0.11555392853994134,
          0.1581347975700339,
          0.26107694360998934,
          0.4130624263500287
        ],
        "conc_latency_p95_list": [
          0.0060548709999466155,
          0.01499669475001042,
          0.028643750499952603,
          0.058125223350015166,
          0.09157506069996088,
          0.12197972049999066,
          0.18427210214998127,
          0.24925758274994791
        ],
        "conc_latency_avg_list": [
          0.004570292678859688,
          0.009346250124765887,
          0.01862953539550514,
          0.036622078273554445,
          0.05650672965547461,
          0.07569008427615372,
          0.1145797859643314,
          0.15085457710523364
        ],
        "st_ideal_insert_duration": 0,
        "st_search_stage_list": [],
        "st_search_time_list": [],
        "st_max_qps_list_list": [],
        "st_recall_list": [],
        "st_ndcg_list": [],
        "st_serial_latency_p99_list": [],
        "st_serial_latency_p95_list": [],
        "st_conc_failed_rate_list": [],
        "st_conc_num_list_list": [],
        "st_conc_qps_list_list": [],
        "st_conc_latency_p99_list_list": [],
        "st_conc_latency_p95_list_list": [],
        "st_conc_latency_avg_list_list": []
      },
      "task_config": {
        "db": "PgVector",
        "db_config": {
          "db_label": "my_postgresql_db",
          "version": "",
          "note": "",
          "user_name": "**********",
          "password": "**********",
          "host": "a407200-akamai-prod-183144-default.g2a.akamaidb.net",
          "port": 10033,
          "db_name": "defaultdb",
          "table_name": "vdbbench_table_test"
        },
        "db_case_config": {
          "metric_type": "COSINE",
          "create_index_before_load": false,
          "create_index_after_load": true,
          "iterative_scan": "relaxed_order",
          "m": 16,
          "ef_construction": 128,
          "ef_search": 128,
          "index": "hnsw",
          "maintenance_work_mem": null,
          "max_parallel_workers": null,
          "quantization_type": "vector",
          "table_quantization_type": "vector",
          "reranking": false,
          "quantized_fetch_limit": null,
          "reranking_metric": "COSINE"
        },
        "case_config": {
          "case_id": 50,
          "custom_case": {},
          "k": 100,
          "concurrency_search_config": {
            "num_concurrency": [
              1,
              5,
              10,
              20,
              30,
              40,
              60,
              80
            ],
            "concurrency_duration": 30,
            "concurrency_timeout": 3600
          }
        },
        "stages": [
          "drop_old",
          "load",
          "search_serial",
          "search_concurrent"
        ]
      },
      "label": ":)"
    }
  ],
  "file_fmt": "result_{}_{}_{}.json",
  "timestamp": 1766966400
}
```

This example is from `pgvector` running on an Akamai Managed Database (`g6-standard-2`: 2 vCPUs, 4GB RAM) with 50,000 vectors at 1,536 dimensions using HNSW indexing.

For this test set, VectorDBBench ran on a separate Linode instance (`g6-standard-8`: 8 vCPUs, 16GB RAM), which provided enough memory to run tests up to a concurrency level of 80.

Note that the compute instance running VectorDBBench needs sufficient RAM to handle multiple concurrent test processes, but this is separate from the database instance being benchmarked. Higher-concurrency tests require more RAM on the benchmarking machine, not necessarily on the database server.

The key metrics examined in this guide are:

  - **Latency percentiles** (p50, p95, p99)
  - **QPS** (queries per second)
  - **Recall@K** accuracy measurements
  - **Resource usage** (memory, CPU, storage)
  - **QP$** (queries per dollar) for cost efficiency

#### Understanding latency percentiles

Latency percentiles tell you what most users experience, not just averages. Imagine you run 100 queries and sort them by speed from fastest to slowest:

  - **p50**: The speed of the 50th query (the median). Half were faster, half were slower.
  - **p95**: The speed of the 95th query. 95% of queries were this fast or faster, but 5% were slower.
  - **p99**: The speed of the 99th query. 99% of queries were this fast or faster, but 1% were slower

p99 matters more than averages because it shows your worst-case user experience. If p99 is 500ms, that means 1 out of every 100 users waits half a second or more.

In the example results shown above, the serial (single-threaded) search shows p99 of 7.2ms and p95 of 5.3ms. This indicates that in the best-case scenario with no concurrent load, 99% of queries complete in under 7.2ms, which is excellent performance for real-time applications. However, these numbers change significantly under load with concurrency in play.

#### Concurrency test results

The example benchmark tested performance at eight different concurrency levels, revealing how the system behaves as multiple users query simultaneously. The throughput (QPS) by concurrency level was:

| Number of Clients |   QPS   |
|-------------------|---------|
|         1         | 217.79  |
|         5         | 533.95  |
|        10         | 534.87  |
|        20         | 542.86  |
|        30         | 523.40  |
|        40         | 519.03  |
|        60         | 505.61  |
|        80         | 502.77  |

The system reached peak throughput (542.86 QPS) at 20 concurrent clients, after which performance declined slightly at higher concurrency levels. Notice that throughput more than doubled, going from 1 to 5 clients, but barely improved from 5 to 20 clients. This indicates the two vCPU instance was approaching its limits early on.

As concurrency increased, individual query latency grew substantially:

| Number of Clients | p99 Latency |
|-------------------|-------------|
|         1         |    8.2ms    |
|         5         |   21.1ms    |
|        10         |   39.3ms    |
|        20         |   73.0ms    |
|        30         |  115.6ms    |
|        40         |  158.1ms    |
|        60         |  261.1ms    |
|        80         |  413.1ms    |

At 80 concurrent clients, the p99 latency (413.1ms) was 50x worse than single-client performance 7.2ms). This dramatic increase shows the system under severe resource constraints, with queries spending significant time waiting for CPU availability.

#### Understanding QPS and concurrency

When you see high QPS but poor latency at high concurrency levels, here's what is happening:

At low concurrency (1-5 clients), the database CPU often sits idle, waiting for network round-trips (sending queries and results) and client preparation time (processing results and preparing the next query). This is why single-client QPS is often much lower than peak QPS.

At higher concurrency (10+ clients), multiple queries keep the CPU constantly busy. While one query is in network transit, others are being processed. CPU utilization reaches 100%, and throughput (QPS) reaches its maximum.

But once the CPU is fully saturated, adding more concurrent clients doesn't increase throughput; it creates a queue. The QPS stays constant because the CPU can only process so many queries per second. However, latency increases as queries wait longer in the queue before being processed.

#### Peak performance and finding the optimal operating point

When you see benchmark results, you may notice that **peak performance** (or **peak throughput**) occurs at some concurrency level, but the **optimal operating point** (or **recommended concurrency level**) is at a lower concurrency level. Why is this?

*Peak performance* is the maximum total throughput the system can achieve. At this point, you're squeezing every last query out of the CPU, but individual query latency has degraded significantly.

The *recommended concurrency level* is the best balance of throughput AND acceptable latency. At this sweet spot, you might get 98-99% of peak throughput while achieving a much better user experience.

For production systems, operate at this sweet spot rather than at peak. This gives you good throughput with low latency and headroom for occasional traffic spikes.

#### Why CPU count matters

Vector search is CPU-intensive work. Each query requires graph traversal through the HNSW index, distance calculations on high-dimensional vectors (1,536 dimensions means 1,536 multiplications per comparison), and result ranking and sorting.

With only two vCPUs, this instance could process roughly 540 queries per second regardless of how many clients were waiting. More CPUs enable more queries to be processed in parallel. A 4 vCPU instance would likely deliver 2,000+ QPS (nearly 4x improvement), with better latency under the same concurrent load and the ability to handle more concurrent users. Index builds would be faster, and you would have better support for larger datasets.

Running your database on a machine with more CPUs fundamentally changes the system's capacity and responsiveness.

#### Search accuracy

The benchmark measured two accuracy metrics that are critical for vector search:

1. **Recall**: Of the 100 true nearest neighbors for each query, the system correctly found an average of 97.04. This means only about three vectors out of 100 were missed. For most production applications, 97% recall is excellent. Users get highly relevant results.
2. **NDCG** (Normalized Discounted Cumulative Gain): This measures ranking quality on a scale from 0.0 (worst) to 1.0 (perfect). A score of 0.9758 indicates that not only were the right neighbors found, but they appeared in nearly optimal order. The most similar vectors consistently ranked highest in the results. This is most important for applications like semantic search or recommendation systems, where ranking matters as much as the results themselves.

#### Cost efficiency

Calculate QP$ (queries per dollar) to compare cost-effectiveness.

![QP$ formula](QPS2.png)

Consider these example benchmarks:

| Instance Size      | Monthly Cost | Peak QPS |  QP$  |
|--------------------|--------------|----------|-------|
| 2 vCPU, 4GB RAM    | $63          |   540    |  8.6  |
| 4 vCPU, 8GB RAM    | $126         |  2000    | 15.9  |

The larger instance costs twice as much but delivers 3.7x the performance (2000/540), making it 1.85x (15.9/8.6) more cost-efficient despite the higher price.

### Next steps after benchmarking

If the benchmarking results from your test setup meet your performance needs, then document this configuration for future reference. Plan for 2-3x growth headroom to avoid emergency scaling. Set up production system monitoring to catch performance degradation early. Establish your performance baselines so you can track changes over time.

If the results do not meet your needs, then you can systematically explore other options:

  - Test larger instance sizes to see if more resources may solve the problem.
  - Optimize index parameters. Tune the HNSW parameters (`m`, `ef_construction`, and `ef_search`) to see how they affect performance.
  - Consider data structure changes, such as reducing vector dimensionality.

### Conclusion

Benchmarking vector databases, such as `pgvector` on Akamai Managed PostgreSQL, provides the concrete data you need to make informed decisions about performance, costs, and scalability. By understanding the key metrics and using tools such as VectorDBBench, you can obtain and interpret results in the context of your specific workload. With the numbers to guide your decisions, you can confidently deploy vector search capabilities that meet your application's needs.
