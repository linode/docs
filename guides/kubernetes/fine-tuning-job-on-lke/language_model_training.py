import kfp.dsl as dsl
from kfp.dsl import Input, Output, Dataset, Model
BASE_IMAGE='nvcr.io/nvidia/ai-workbench/python-cuda122:1.0.6'
PACKAGES=['accelerate>=0.12.0', 'torch>=1.3', 'datasets>=2.14.0', 'sentencepiece!=0.1.92', 'protobuf', 'evaluate', 'scikit-learn', 'transformers', 'hf_xet']
@dsl.component(base_image=BASE_IMAGE, packages_to_install=PACKAGES)
def train_language_model(model_name: str, epochs: int, output_model: Output[Model]):
    import logging
    import math
    import os
    import sys
    from dataclasses import dataclass, field
    from itertools import chain
    from typing import Optional

    import datasets
    import evaluate
    import torch
    from datasets import load_dataset

    import transformers
    from transformers import (
        AutoConfig,
        AutoModelForMaskedLM,
        AutoTokenizer,
        DataCollatorForLanguageModeling,
        Trainer,
        TrainingArguments,
        set_seed,
    )
    from transformers.utils.versions import require_version

    logger = logging.getLogger(__name__)

    @dataclass
    class ModelArguments:
        """
        Arguments pertaining to which model/config/tokenizer we are going to fine-tune, or train from scratch.
        """

        model_name_or_path: Optional[str] = field(
            default=None,
            metadata={
                "help": (
                    "The model checkpoint for weights initialization. Don't set if you want to train a model from scratch."
                )
            },
        )
        config_overrides: Optional[str] = field(
            default=None,
            metadata={
                "help": (
                    "Override some existing default config settings when a model is trained from scratch. Example: "
                    "n_embd=10,resid_pdrop=0.2,scale_attn_weights=false,summary_type=cls_index"
                )
            },
        )
        config_name: Optional[str] = field(
            default=None, metadata={"help": "Pretrained config name or path if not the same as model_name"}
        )
        cache_dir: Optional[str] = field(
            default=None,
            metadata={"help": "Where do you want to store the pretrained models downloaded from huggingface.co"},
        )
        use_fast_tokenizer: bool = field(
            default=True,
            metadata={"help": "Whether to use one of the fast tokenizer (backed by the tokenizers library) or not."},
        )
        model_revision: str = field(
            default="main",
            metadata={"help": "The specific model version to use (can be a branch name, tag name or commit id)."},
        )
        token: str = field(
            default=None,
            metadata={
                "help": (
                    "The token to use as HTTP bearer authorization for remote files. If not specified, will use the token "
                    "generated when running `huggingface-cli login` (stored in `~/.huggingface`)."
                )
            },
        )
        trust_remote_code: bool = field(
            default=False,
            metadata={
                "help": (
                    "Whether to trust the execution of code from datasets/models defined on the Hub."
                    " This option should only be set to `True` for repositories you trust and in which you have read the"
                    " code, as it will execute code present on the Hub on your local machine."
                )
            },
        )
        torch_dtype: Optional[str] = field(
            default=None,
            metadata={
                "help": (
                    "Override the default `torch.dtype` and load the model under this dtype. If `auto` is passed, the "
                    "dtype will be automatically derived from the model's weights."
                ),
                "choices": ["auto", "bfloat16", "float16", "float32"],
            },
        )
        low_cpu_mem_usage: bool = field(
            default=False,
            metadata={
                "help": (
                    "It is an option to create the model as an empty shell, then only materialize its parameters when the pretrained weights are loaded. "
                    "set True will benefit LLM loading time and RAM consumption."
                )
            },
        )

        def __post_init__(self):
            if self.config_overrides is not None and (self.config_name is not None or self.model_name_or_path is not None):
                raise ValueError(
                    "--config_overrides can't be used in combination with --config_name or --model_name_or_path"
                )


    @dataclass
    class DataTrainingArguments:
        """
        Arguments pertaining to what data we are going to input our model for training and eval.
        """

        dataset_name: Optional[str] = field(
            default=None, metadata={"help": "The name of the dataset to use (via the datasets library)."}
        )
        dataset_config_name: Optional[str] = field(
            default=None, metadata={"help": "The configuration name of the dataset to use (via the datasets library)."}
        )
        train_file: Optional[str] = field(default=None, metadata={"help": "The input training data file (a text file)."})
        validation_file: Optional[str] = field(
            default=None,
            metadata={"help": "An optional input evaluation data file to evaluate the perplexity on (a text file)."},
        )
        overwrite_cache: bool = field(
            default=False, metadata={"help": "Overwrite the cached training and evaluation sets"}
        )
        validation_split_percentage: Optional[int] = field(
            default=5,
            metadata={
                "help": "The percentage of the train set used as validation set in case there's no validation split"
            },
        )
        max_seq_length: Optional[int] = field(
            default=None,
            metadata={
                "help": (
                    "The maximum total input sequence length after tokenization. Sequences longer "
                    "than this will be truncated."
                )
            },
        )
        preprocessing_num_workers: Optional[int] = field(
            default=None,
            metadata={"help": "The number of processes to use for the preprocessing."},
        )
        mlm_probability: float = field(
            default=0.15, metadata={"help": "Ratio of tokens to mask for masked language modeling loss"}
        )
        line_by_line: bool = field(
            default=False,
            metadata={"help": "Whether distinct lines of text in the dataset are to be handled as distinct sequences."},
        )
        pad_to_max_length: bool = field(
            default=False,
            metadata={
                "help": (
                    "Whether to pad all samples to `max_seq_length`. "
                    "If False, will pad the samples dynamically when batching to the maximum length in the batch."
                )
            },
        )
        max_train_samples: Optional[int] = field(
            default=None,
            metadata={
                "help": (
                    "For debugging purposes or quicker training, truncate the number of training examples to this "
                    "value if set."
                )
            },
        )
        max_eval_samples: Optional[int] = field(
            default=None,
            metadata={
                "help": (
                    "For debugging purposes or quicker training, truncate the number of evaluation examples to this "
                    "value if set."
                )
            },
        )
        streaming: bool = field(default=False, metadata={"help": "Enable streaming mode"})

        def __post_init__(self):
            if self.streaming:
                require_version("datasets>=2.0.0", "The streaming feature requires `datasets>=2.0.0`")

            if self.dataset_name is None and self.train_file is None and self.validation_file is None:
                raise ValueError("Need either a dataset name or a training/validation file.")
            else:
                if self.train_file is not None:
                    extension = self.train_file.split(".")[-1]
                    if extension not in ["csv", "json", "txt"]:
                        raise ValueError("`train_file` should be a csv, a json or a txt file.")
                if self.validation_file is not None:
                    extension = self.validation_file.split(".")[-1]
                    if extension not in ["csv", "json", "txt"]:
                        raise ValueError("`validation_file` should be a csv, a json or a txt file.")


    def train():
        model_args = ModelArguments(
            model_name_or_path=model_name)
        data_args = DataTrainingArguments(
            dataset_name='wikitext',
            dataset_config_name='wikitext-2-raw-v1'
        )
        training_args = TrainingArguments(
            num_train_epochs=epochs,
            per_device_train_batch_size=8,
            per_device_eval_batch_size=8
        )

        torch.set_float32_matmul_precision('high')

        # Setup logging
        logging.basicConfig(
            format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
            datefmt="%m/%d/%Y %H:%M:%S",
            handlers=[logging.StreamHandler(sys.stdout)],
        )

        transformers.utils.logging.set_verbosity_info()
        # log_level = transformers.logging.INFO
        log_level = training_args.get_process_log_level()
        logger.setLevel(log_level)
        datasets.utils.logging.set_verbosity(log_level)
        transformers.utils.logging.set_verbosity(log_level)
        transformers.utils.logging.enable_default_handler()
        transformers.utils.logging.enable_explicit_format()

        # Log on each process the small summary:
        logger.warning(
            f"Process rank: {training_args.local_rank}, device: {training_args.device}, n_gpu: {training_args.n_gpu}, "
            + f"distributed training: {training_args.parallel_mode.value == 'distributed'}, 16-bits training: {training_args.fp16}"
        )
        # Set the verbosity to info of the Transformers logger (on main process only):
        logger.info(f"Training/evaluation parameters {training_args}")

        # Set seed before initializing model.
        set_seed(training_args.seed)

        # Get the datasets: you can either provide your own CSV/JSON/TXT training and evaluation files (see below)
        # or just provide the name of one of the public datasets available on the hub at https://huggingface.co/datasets/
        # (the dataset will be downloaded automatically from the datasets Hub
        #
        # For CSV/JSON files, this script will use the column called 'text' or the first column. You can easily tweak this
        # behavior (see below)
        #
        # In distributed training, the load_dataset function guarantee that only one local process can concurrently
        # download the dataset.
        if data_args.dataset_name is not None:
            # Downloading and loading a dataset from the hub.
            raw_datasets = load_dataset(
                data_args.dataset_name,
                data_args.dataset_config_name,
                cache_dir=model_args.cache_dir,
                token=model_args.token,
                streaming=data_args.streaming,
                trust_remote_code=model_args.trust_remote_code,
            )
            if "validation" not in raw_datasets.keys():
                raw_datasets["validation"] = load_dataset(
                    data_args.dataset_name,
                    data_args.dataset_config_name,
                    split=f"train[:{data_args.validation_split_percentage}%]",
                    cache_dir=model_args.cache_dir,
                    token=model_args.token,
                    streaming=data_args.streaming,
                    trust_remote_code=model_args.trust_remote_code,
                )
                raw_datasets["train"] = load_dataset(
                    data_args.dataset_name,
                    data_args.dataset_config_name,
                    split=f"train[{data_args.validation_split_percentage}%:]",
                    cache_dir=model_args.cache_dir,
                    token=model_args.token,
                    streaming=data_args.streaming,
                    trust_remote_code=model_args.trust_remote_code,
                )
        else:
            data_files = {}
            if data_args.train_file is not None:
                data_files["train"] = data_args.train_file
                extension = data_args.train_file.split(".")[-1]
            if data_args.validation_file is not None:
                data_files["validation"] = data_args.validation_file
                extension = data_args.validation_file.split(".")[-1]
            if extension == "txt":
                extension = "text"
            raw_datasets = load_dataset(
                extension,
                data_files=data_files,
                cache_dir=model_args.cache_dir,
                token=model_args.token,
            )

            # If no validation data is there, validation_split_percentage will be used to divide the dataset.
            if "validation" not in raw_datasets.keys():
                raw_datasets["validation"] = load_dataset(
                    extension,
                    data_files=data_files,
                    split=f"train[:{data_args.validation_split_percentage}%]",
                    cache_dir=model_args.cache_dir,
                    token=model_args.token,
                )
                raw_datasets["train"] = load_dataset(
                    extension,
                    data_files=data_files,
                    split=f"train[{data_args.validation_split_percentage}%:]",
                    cache_dir=model_args.cache_dir,
                    token=model_args.token,
                )

        # See more about loading any type of standard or custom dataset (from files, python dict, pandas DataFrame, etc) at
        # https://huggingface.co/docs/datasets/loading_datasets.

        # Load pretrained model and tokenizer
        #
        # Distributed training:
        # The .from_pretrained methods guarantee that only one local process can concurrently
        # download model & vocab.
        config_kwargs = {
            "cache_dir": model_args.cache_dir,
            "revision": model_args.model_revision,
            "token": model_args.token,
            "trust_remote_code": model_args.trust_remote_code,
        }
        config = AutoConfig.from_pretrained(model_args.model_name_or_path, **config_kwargs)

        tokenizer_kwargs = {
            "cache_dir": model_args.cache_dir,
            "use_fast": model_args.use_fast_tokenizer,
            "revision": model_args.model_revision,
            "token": model_args.token,
            "trust_remote_code": model_args.trust_remote_code,
        }
        tokenizer = AutoTokenizer.from_pretrained(model_args.model_name_or_path, **tokenizer_kwargs)

        torch_dtype = (
            model_args.torch_dtype
            if model_args.torch_dtype in ["auto", None]
            else getattr(torch, model_args.torch_dtype)
        )
        model = AutoModelForMaskedLM.from_pretrained(
            model_args.model_name_or_path,
            config=config,
            cache_dir=model_args.cache_dir,
            revision=model_args.model_revision,
            token=model_args.token,
            trust_remote_code=model_args.trust_remote_code,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=model_args.low_cpu_mem_usage,
        )

        # We resize the embeddings only when necessary to avoid index errors. If you are creating a model from scratch
        # on a small vocab and want a smaller embedding size, remove this test.
        embedding_size = model.get_input_embeddings().weight.shape[0]
        if len(tokenizer) > embedding_size:
            model.resize_token_embeddings(len(tokenizer))

        # Preprocessing the datasets.
        # First we tokenize all the texts.
        column_names = list(raw_datasets["train"].features)
        text_column_name = "text" if "text" in column_names else column_names[0]

        if data_args.max_seq_length is None:
            max_seq_length = tokenizer.model_max_length
            if max_seq_length > 1024:
                logger.warning(
                    "The chosen tokenizer supports a `model_max_length` that is longer than the default `block_size` value"
                    " of 1024. If you would like to use a longer `block_size` up to `tokenizer.model_max_length` you can"
                    " override this default with `--block_size xxx`."
                )
                max_seq_length = 1024
        else:
            if data_args.max_seq_length > tokenizer.model_max_length:
                logger.warning(
                    f"The max_seq_length passed ({data_args.max_seq_length}) is larger than the maximum length for the "
                    f"model ({tokenizer.model_max_length}). Using max_seq_length={tokenizer.model_max_length}."
                )
            max_seq_length = min(data_args.max_seq_length, tokenizer.model_max_length)

        if data_args.line_by_line:
            # When using line_by_line, we just tokenize each nonempty line.
            padding = "max_length" if data_args.pad_to_max_length else False

            def tokenize_function(examples):
                # Remove empty lines
                examples[text_column_name] = [
                    line for line in examples[text_column_name] if len(line) > 0 and not line.isspace()
                ]
                return tokenizer(
                    examples[text_column_name],
                    padding=padding,
                    truncation=True,
                    max_length=max_seq_length,
                    # We use this option because DataCollatorForLanguageModeling (see below) is more efficient when it
                    # receives the `special_tokens_mask`.
                    return_special_tokens_mask=True,
                )

            with training_args.main_process_first(desc="dataset map tokenization"):
                if not data_args.streaming:
                    tokenized_datasets = raw_datasets.map(
                        tokenize_function,
                        batched=True,
                        num_proc=data_args.preprocessing_num_workers,
                        remove_columns=[text_column_name],
                        load_from_cache_file=not data_args.overwrite_cache,
                        desc="Running tokenizer on dataset line_by_line",
                    )
                else:
                    tokenized_datasets = raw_datasets.map(
                        tokenize_function,
                        batched=True,
                        remove_columns=[text_column_name],
                    )
        else:
            # Otherwise, we tokenize every text, then concatenate them together before splitting them in smaller parts.
            # We use `return_special_tokens_mask=True` because DataCollatorForLanguageModeling (see below) is more
            # efficient when it receives the `special_tokens_mask`.
            def tokenize_function(examples):
                return tokenizer(examples[text_column_name], return_special_tokens_mask=True)

            with training_args.main_process_first(desc="dataset map tokenization"):
                if not data_args.streaming:
                    tokenized_datasets = raw_datasets.map(
                        tokenize_function,
                        batched=True,
                        num_proc=data_args.preprocessing_num_workers,
                        remove_columns=column_names,
                        load_from_cache_file=not data_args.overwrite_cache,
                        desc="Running tokenizer on every text in dataset",
                    )
                else:
                    tokenized_datasets = raw_datasets.map(
                        tokenize_function,
                        batched=True,
                        remove_columns=column_names,
                    )

            # Main data processing function that will concatenate all texts from our dataset and generate chunks of
            # max_seq_length.
            def group_texts(examples):
                # Concatenate all texts.
                concatenated_examples = {k: list(chain(*examples[k])) for k in examples.keys()}
                total_length = len(concatenated_examples[list(examples.keys())[0]])
                # We drop the small remainder, and if the total_length < max_seq_length  we exclude this batch and return an empty dict.
                # We could add padding if the model supported it instead of this drop, you can customize this part to your needs.
                total_length = (total_length // max_seq_length) * max_seq_length
                # Split by chunks of max_len.
                result = {
                    k: [t[i : i + max_seq_length] for i in range(0, total_length, max_seq_length)]
                    for k, t in concatenated_examples.items()
                }
                return result

            # Note that with `batched=True`, this map processes 1,000 texts together, so group_texts throws away a
            # remainder for each of those groups of 1,000 texts. You can adjust that batch_size here but a higher value
            # might be slower to preprocess.
            #
            # To speed up this part, we use multiprocessing. See the documentation of the map method for more information:
            # https://huggingface.co/docs/datasets/process#map

            with training_args.main_process_first(desc="grouping texts together"):
                if not data_args.streaming:
                    tokenized_datasets = tokenized_datasets.map(
                        group_texts,
                        batched=True,
                        num_proc=data_args.preprocessing_num_workers,
                        load_from_cache_file=not data_args.overwrite_cache,
                        desc=f"Grouping texts in chunks of {max_seq_length}",
                    )
                else:
                    tokenized_datasets = tokenized_datasets.map(
                        group_texts,
                        batched=True,
                    )

        train_dataset = tokenized_datasets["train"]
        if data_args.max_train_samples is not None:
            max_train_samples = min(len(train_dataset), data_args.max_train_samples)
            train_dataset = train_dataset.select(range(max_train_samples))

        eval_dataset = tokenized_datasets["validation"]
        if data_args.max_eval_samples is not None:
            max_eval_samples = min(len(eval_dataset), data_args.max_eval_samples)
            eval_dataset = eval_dataset.select(range(max_eval_samples))

        def preprocess_logits_for_metrics(logits, labels):
            if isinstance(logits, tuple):
                # Depending on the model and config, logits may contain extra tensors,
                # like past_key_values, but logits always come first
                logits = logits[0]
            return logits.argmax(dim=-1)

        metric = evaluate.load("accuracy", cache_dir=model_args.cache_dir)

        def compute_metrics(eval_preds):
            preds, labels = eval_preds
            # preds have the same shape as the labels, after the argmax(-1) has been calculated
            # by preprocess_logits_for_metrics
            labels = labels.reshape(-1)
            preds = preds.reshape(-1)
            mask = labels != -100
            labels = labels[mask]
            preds = preds[mask]
            return metric.compute(predictions=preds, references=labels)

        # Data collator
        # This one will take care of randomly masking the tokens.
        pad_to_multiple_of_8 = data_args.line_by_line and training_args.fp16 and not data_args.pad_to_max_length
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=tokenizer,
            mlm_probability=data_args.mlm_probability,
            pad_to_multiple_of=8 if pad_to_multiple_of_8 else None,
        )

        # Initialize our Trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=eval_dataset,
            processing_class=tokenizer,
            data_collator=data_collator,
            compute_metrics=compute_metrics,
            preprocess_logits_for_metrics=preprocess_logits_for_metrics
        )

        # Training
        train_result = trainer.train()
        trainer.save_model()  # Saves the tokenizer too for easy upload
        metrics = train_result.metrics

        max_train_samples = (
            data_args.max_train_samples if data_args.max_train_samples is not None else len(train_dataset)
        )
        metrics["train_samples"] = min(max_train_samples, len(train_dataset))

        trainer.log_metrics("train", metrics)
        trainer.save_metrics("train", metrics)
        trainer.save_state()

        # Evaluation
        logger.info("*** Evaluate ***")

        metrics = trainer.evaluate()

        max_eval_samples = data_args.max_eval_samples if data_args.max_eval_samples is not None else len(eval_dataset)
        metrics["eval_samples"] = min(max_eval_samples, len(eval_dataset))
        try:
            perplexity = math.exp(metrics["eval_loss"])
        except OverflowError:
            perplexity = float("inf")
        metrics["perplexity"] = perplexity

        trainer.log_metrics("eval", metrics)
        trainer.save_metrics("eval", metrics)

        kwargs = {"finetuned_from": model_args.model_name_or_path, "tasks": "fill-mask"}
        if data_args.dataset_name is not None:
            kwargs["dataset_tags"] = data_args.dataset_name
            if data_args.dataset_config_name is not None:
                kwargs["dataset_args"] = data_args.dataset_config_name
                kwargs["dataset"] = f"{data_args.dataset_name} {data_args.dataset_config_name}"
            else:
                kwargs["dataset"] = data_args.dataset_name

        trainer.create_model_card(**kwargs)

        trainer.model.save_pretrained(output_model.path)

        logger.info("*** Done ***")

    #Entrypoint
    train()


@dsl.pipeline(name="language_model_training")
def sft_training_pipeline(epochs: int):
    train_language_model(model_name='answerdotai/ModernBERT-base', epochs=epochs)

from kfp import compiler

compiler.Compiler().compile(sft_training_pipeline, 'language_model_pipeline.yaml')