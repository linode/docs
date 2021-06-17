---
# Shortguide: Uploading a Custom Image through the Linode CLI

headless: true
show_on_rss_feed: false
---

Another method for uploading a compatible image file is directly through the [Linode CLI](https://www.linode.com/docs/guides/linode-cli/).

1.  Run the following command to install or update the Linode CLI:

        pip3 install linode-cli --upgrade

2.  If this is your first time using the CLI or if you encounter any authorization issues, reconfigure (and authorize) your installation:

        linode-cli configure

3.  Create a Custom Image and upload the image file using the following command, replacing *[Label]* with a unique label and *[File]* with the filename and path of the image file you'd like to use:

        linode-cli image-upload --label "[Label]" [File]

    You can also optionally specify additional details by adding the following options:

    - `--description "[Description]"`, replacing *[Description]* with the text you'd like to use.
    - `--region "[region-id]"`, replacing *[region-id]* with the id of the region you'd like to use to upload the file. If this is left out, the default region you specified when configuring the Linode CLI will be used.

    In the example below, a Custom Image will be created in the Newark data center with the label of "Example Image", a description of "Some details about the image", and the image file "~/Downloads/image-file.img.gz" will be uploaded.

        linode-cli image-upload --label "Example Image" --description "Some details about the image" --region "us-east" ~/Downloads/image-file.img.gz

4. After running the above command, a progress bar will be displayed that indicates the total progress of the file upload. Once completed, a single data row table will be outputted with the details regarding the new Custom Image and a status of *pending_upload*.

    The image upload may take a few minutes to fully process. To verify that the image is available for use, run the following command and make sure the new Custom Image has a status of *available*:

        linode-cli images list --is_public false