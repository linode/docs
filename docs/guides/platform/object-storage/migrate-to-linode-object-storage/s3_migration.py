import os
import re
import shutil

import configparser

import boto3
from botocore.exceptions import ClientError

CONFIG_FILE_LOCATION = "s3_migration.conf"
TEMP_STORAGE_DIRECTORY = "temp_storage/"

def initialize_temporary_storage():
    if not os.path.exists(TEMP_STORAGE_DIRECTORY):
        os.mkdir(TEMP_STORAGE_DIRECTORY)
    else:
        print("\nAbort: Temporary storage directory " + TEMP_STORAGE_DIRECTORY + " already exists. Remove it or specify a different temporary storage directory.")
        exit()

def remove_temporary_storage():
    shutil.rmtree(TEMP_STORAGE_DIRECTORY)

def create_s3_client(instance_designation):
    config = configparser.ConfigParser()
    config.read(CONFIG_FILE_LOCATION)

    if instance_designation not in config:
        print("\nAbort: Missing configration entry for " + instance_designation + ".")
        exit()

    instance_config = config[instance_designation]

    if "endpoint_url" in instance_config:
        return boto3.client(
            service_name = "s3",
            aws_access_key_id = instance_config["aws_access_key_id"],
            aws_secret_access_key = instance_config["aws_secret_access_key"],
            region_name = instance_config["region_name"],
            endpoint_url = instance_config["endpoint_url"],
            use_ssl = True
        )
    else:
        return boto3.client(
            service_name = "s3",
            aws_access_key_id = instance_config["aws_access_key_id"],
            aws_secret_access_key = instance_config["aws_secret_access_key"],
            region_name = instance_config["region_name"],
            use_ssl = True
        )

def get_bucket_list(client):
    buckets = client.list_buckets()
    return buckets["Buckets"]

def has_matching_buckets(source_bucket, destination_bucket_list):
    matching_buckets = [x for x in destination_bucket_list if x["Name"] == source_bucket]
    return len(matching_buckets) > 0

def create_bucket(client, bucket_name):
    try:
        client.create_bucket(Bucket=bucket_name)
    except ClientError as e:
        return False
    return True

def copy_bucket_objects(source_client, destination_client, bucket_name):
    source_bucket_objects = source_client.list_objects(Bucket=bucket_name)["Contents"]

    for source_object in source_bucket_objects:
        source_object_name = source_object["Key"]

        if re.search(r'/$', source_object_name):
            os.mkdir(TEMP_STORAGE_DIRECTORY + source_object_name)
        else:
            source_client.download_file(bucket_name, source_object_name, TEMP_STORAGE_DIRECTORY + source_object_name)

            print("\tTranferring " + source_object_name + " to destination.")
            try:
                destination_client.upload_file(TEMP_STORAGE_DIRECTORY + source_object_name, bucket_name, source_object_name)
            except ClientError as e:
                print("\t\tError occurred while uploading " + source_object_name + ".")

def create_matching_buckets(source_client, destination_client):
    source_bucket_list = get_bucket_list(source_client)
    destination_bucket_list = get_bucket_list(destination_client)

    for bucket in source_bucket_list:
        if not has_matching_buckets(bucket["Name"], destination_bucket_list):
            print("\tCreating " + bucket["Name"] + " on destination.")
            bucket_creation_result = create_bucket(destination_client, bucket["Name"])
            print("\t\t" + ("Success" if bucket_creation_result else "Failed"))

def copy_instance_objects(source_client, destination_client):
    source_bucket_list = get_bucket_list(source_client)
    destination_bucket_list = get_bucket_list(destination_client)

    for bucket in source_bucket_list:
        if has_matching_buckets(bucket["Name"], destination_bucket_list):
            copy_bucket_objects(source_client, destination_client, bucket["Name"])
        else:
            print("\tDestination does not have " + bucket["Name"] + ". Create matching buckets first to copy objects to.")

def main():
    aws_client = create_s3_client("awss3")
    linode_client = create_s3_client("linodes3")

    print("Initiating migration from AWS S3 to Linode Object Storage.")

    print("\nCreating a temporary storage directory.")
    initialize_temporary_storage()

    print("\nChecking for matching buckets on Linode.")
    create_matching_buckets(aws_client, linode_client)

    print("\nCopying objects from AWS to Linode.")
    copy_instance_objects(aws_client, linode_client)

    print("\nCleaning up temporary storage.")
    remove_temporary_storage()

if __name__ == '__main__':
    main()

