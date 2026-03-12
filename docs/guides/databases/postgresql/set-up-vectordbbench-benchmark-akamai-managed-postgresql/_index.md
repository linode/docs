---
slug: set-up-vectordbbench-benchmark-akamai-managed-postgresql
title: "How to Set Up VectorDBBench to Benchmark Akamai Managed PostgreSQL"
description: "Learn how to install and run VectorDBBench on an Akamai Managed Database instance of PostgreSQL with pgvector to benchmark vector search performance."
og_description: "Step-by-step guide to benchmarking Akamai Managed PostgreSQL with pgvector using VectorDBBench."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-12-29
keywords: ['vectordbbench', 'postgresql', 'pgvector', 'vector database', 'benchmarking', 'akamai managed database', 'linode']
deprecated: false
---

This guide walks through the steps to set up and run VectorDBBench on an Akamai Managed Database instance of PostgreSQL with pgvector installed.

## Provision Akamai Cloud Resources
The examples in this guide use the following resources:

* A shared CPU Linode instance with 8 vCPUs and 16GB of memory (g6-standard-8) where VectorDBBench is installed.
* An Akamai Managed Database instance running PostgreSQL on a shared CPU Linode instance with 2 vCPUs and 4GB of memory (g6-standard-2).

Both resources need to be deployed in the same region.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. Create a g6-standard-8 instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  On a multi-user system, it is best to create a dedicated user account with `sudo` access. Use this account for the instructions in this guide.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

1. [Create a new database cluster](https://techdocs.akamai.com/cloud-computing/docs/aiven-manage-database#create-a-new-database-cluster) to set up your database. When doing so, ensure that you:

- Choose the **PostgreSQL v18** engine
- Select the same region you used for the Compute Instance
- Use a **shared CPU instance with 4GB of memory** (g6-standard-2)
- Set the number of nodes to **1**
- Under networking access control, **add the IPv6 address** of your Linode instance to the allow list.

### Install initial dependencies
Update and install the latest packages with the following command:

```
sudo apt update && apt upgrade
```

Install the additional dependencies you need for Python and VectorDBBench.

```
sudo apt install \
  build-essential zlib1g zlib1g-dev libssl-dev libffi-dev
```

### Install and use Python 3.11+
VectorDBBench requires Python version 3.11 or greater. Using the instructions for installing pyenv, run the following command:

```
sudo curl -fsSL https://pyenv.run | bash
```

To ensure pyenv is added to your shell's load path, add the following lines to the end of your root user's .bashrc file:

```
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - bash)"
```

Source the .bashrc file or exit the shell and use ssh again to reconnect. Verify that pyenv has been installed and is accessible:

```
pyenv --version
```

```
pyenv 2.6.17
```

Install Python 3.11.0.

```
pyenv install 3.11.0
```

Set Python 3.11.0 as the version to be used on your machine.

```
pyenv global 3.11.0
python --version
```

```
Python 3.11.0
```

### Install psql client
Run the following command to install the psql client:

```
sudo apt install postgresql-client
```

### Install pgvector extension on the PostgreSQL database
In the Akamai Cloud console, find the details for the managed database instance. Take note of the connection details.

In the shell connected to the Compute Instance, use the psql client to connect to the database. Ensure that you replace the `Host` and `Port`with the details from **Connection Details** section of the **Summary** in the Akamai Cloud console. For example:

```
psql --host=a406247-akamai-prod-183144-default.g2a.akamaidb.net \
  --port=10033 \
  --username=akmadmin \
  --password \
  defaultdb
```

After you are connected, run the following command to install the pgvector extension:

```
create extension vector;
```

```
CREATE EXTENSION
```

Exit the psql client.

### Prepare a virtual environment in Python
Set up a Python virtual environment. Then, install the dependencies you will need for Python to connect to PostgreSQL.

```
python -m venv ./venv
source ./venv/bin/activate
pip install psycopg pgvector
```

### Install VectorDBBench
Create a working folder for VectorDBBench. Then, within the Python venv, install the application along with the database client for PostgreSQL with pgvector.

```
mkdir benchmark && cd benchmark
pip install psycopg vectordb-bench vectordb-bench[vectordb]
```

Verify that you have installed VectorDBBench successfully:

```
vectordbbench pgvectorhnsw --help
```

```
Usage: vectordbbench pgvectorhnsw [OPTIONS]

Options:
  --config-file PATH              Read configuration from yaml file
…
 --help                          Show this message and exit.
```

## Configure and Run VectorDBBench
Although VectorDBBench can be run with command-line arguments, you may find it simpler to create a single configuration file for repeatability. Within the working folder, create a file called config.yaml. Replace the example file contents below with your managed database's connection information credentials:

```
pgvectorhnsw:
  db_label: <my_postgresql_db>
  user_name: akmadmin
  password: <your-password>
  db_name:  defaultdb
  host: <your-host>
  port: 10033
  m: 16
  ef_construction: 128
  ef_search: 128
```

Save the file. Run VectorDBBench, using this configuration.

```
vectordbbench pgvectorhnsw --config-file=./config.yaml
```

The benchmarking process will begin. It may take several minutes or more.

```
INFO: Task:
TaskConfig(db=<DB.PgVector: 'PgVector'>, db_config=PgVectorConfig(db_label='my_postgresql_db', version='', note='', user_name=SecretStr('******'), password=SecretStr('******'), host='a406247-akamai-prod-183144-default.g2a.akamaidb.net', port=10033, db_name='defaultdb', table_name='vdbbench_table_test'), db_case_config=PgVectorHNSWConfig(metric_type=None, create_index_before_load=False, create_index_after_load=True, iterative_scan='relaxed_order', m=16, ef_construction=128, ef_search=128, index=<IndexType.ES_HNSW: 'hnsw'>, maintenance_work_mem=None, max_parallel_workers=None, quantization_type=None, table_quantization_type=None, reranking=False, quantized_fetch_limit=None, reranking_metric='COSINE'), case_config=CaseConfig(case_id=<CaseType.Performance1536D50K: 50>, custom_case={}, k=100, concurrency_search_config=ConcurrencySearchConfig(num_concurrency=[1, 5, 10, 20, 30, 40, 60, 80], concurrency_duration=30, concurrency_timeout=3600)), stages=['drop_old', 'load', 'search_serial', 'search_concurrent'])
 (cli.py:649) (34859)
INFO: generated uuid for the tasks: 32143a10abef4c9abc1b625e771ef581 (interface.py:76) (34859)
INFO | DB             | CaseType     Dataset               Filter | task_label (task_runner.py:405)
INFO | -----------    | ------------ -------------------- ------- | -------    (task_runner.py:405)
INFO | PgVector-my_postgresql_db | Performance  OpenAI-SMALL-50K         0.0 | 32143a10abef4c9abc1b625e771ef581 (task_runner.py:405)
INFO: task submitted: id=99678c5cf422473cbd4f36051f5044f6, 32143a10abef4c9abc1b625e771ef581, case number: 1 (interface.py:251) (34859)
INFO: [1/1] start case: {'label': <CaseLabel.Performance: 2>, 'name': 'Search Performance Test (50K Dataset, 1536 Dim)', 'dataset': {'data': {'name': 'OpenAI', 'size': 50000, 'dim': 1536, 'metric_type': <MetricType.COSINE: 'COSINE'>}}, 'db': 'PgVector-my_postgresql_db'}, drop_old=True (interface.py:181) (34868)
INFO: Starting run (task_runner.py:143) (34868)
…
INFO |DB       | db_label            case                                            label                            | load_dur    qps         latency(p99)    latency(p95)    recall        max_load_count | label (models.py:455)
INFO |-------- | ------------------- ----------------------------------------------- -------------------------------- | ----------- ----------- --------------- --------------- ------------- -------------- | ----- (models.py:455)
INFO |PgVector | my_postgresql_db    Search Performance Test (50K Dataset, 1536 Dim) 32143a10abef4c9abc1b625e771ef581 | 80.2113     542.8612    0.0072          0.0053          0.9704        0              | :)    (models.py:455)
INFO: write results to disk /root/venv/lib/python3.11/site-packages/vectordb_bench/results/PgVector/result_20251229_32143a10abef4c9abc1b625e771ef581_pgvector.json (models.py:292) (33144)
INFO: Success to finish task: label=32143a10abef4c9abc1b625e771ef581, run_id=32143a10abef4c9abc1b625e771ef581 (interface.py:222) (33144)
```

VectorDBBench writes the benchmarking results to a JSON file. Near the end of the test run log, VectorDBBench notes the name and location of the file. For example, in the test run above, the file can be found at:

```
/root/venv/lib/python3.11/site-packages/vectordb_bench/results/PgVector/result_20251229_32143a10abef4c9abc1b625e771ef581_pgvector.json
```

Use an application such as sftp to transfer that file to your local machine for further analysis. Running the JSON file through jq, you will see that the file looks like the following:

```
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
          "user_name": "******",
          "password": "******",
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

### Troubleshooting early process termination
If the benchmarking processes terminates mid-run, the issue may be related to memory. You might simply see the message, "Aborted!" like this:

```
INFO: End search in concurrency 40: dur=30.60221093400014s, total_count=15561, qps=508.4927 (mp_runner.py:146) (34868)
INFO: Start search 30s in concurrency 60, filters: type=<FilterOp.NonFilter: 'NonFilter'> filter_rate=0.0 gt_file_name='neighbors.parquet' (mp_runner.py:123) (34868)

Aborted!
```

Troubleshoot this by checking /var/log/syslog. The log may indicate an out of memory error. For example:

```
localhost kernel: oom-kill:constraint=CONSTRAINT_NONE,nodemask=(null),cpuset=/,mems_allowed=0,global_oom,task_memcg=/user.slice/user-0.slice/session-6.scope,task=python,pid=34868,uid=0
localhost kernel: Out of memory: Killed process 34868 (python) total-vm:2510388kB, anon-rss:84176kB, file-rss:172kB, shmem-rss:0kB, UID:0 pgtables:1484kB oom_score_adj:0
localhost kernel: systemd-journald[2656]: Under memory pressure, flushing caches.
localhost systemd[1]: user@0.service: A process of this unit has been killed by the OOM killer.
localhost systemd[1]: user@0.service: Main process exited, code=killed, status=9/KILL
```

As VectorDBBench attempts to run multiple concurrent clients to test the performance of the PostgreSQL instance, this may require more memory on your Linode instance than is available.

This can be solved in two ways:

Use a compute instance with more memory.
Change the configuration of the VectorDBBench run to remove the high-concurrency runs.

VectorDBBench runs 30-second tests with different levels of concurrency. By default, it runs a separate test for each of the following concurrency levels: [1, 5, 10, 20, 30, 40, 60, 80] Higher levels of concurrency (such as 60 or 80) may cause your Linode instance to run out of memory.

To change the set of concurrency levels used in the test, set the num_concurrency to a comma-separated list of numbers in the pgvectorhnsw section of your config.yaml file. For example, the following line will result in only three runs, with concurrency levels of 1, 5, and 10.

```
num_concurrency: "1,5,10"
```

## Analyzing Benchmarking Results
To better understand the VectorDBBench results in the JSON file you have retrieved, refer to [Vector Database Benchmarking](/docs/guides/databases/vector-db-benchmarking).
