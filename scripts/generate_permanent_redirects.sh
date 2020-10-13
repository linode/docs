egrep -R '<!DOCTYPE html><html><head><title>(https:\/\/.*\/)<\/title><link rel="canonical" href="(https:\/\/.*\/)"\/><meta name="robots" content="noindex"><meta charset="utf-8" \/><meta http-equiv="refresh" content="0; url=(https:\/\/.*\/)" \/><\/head><\/html>' ../public | while read -r line ; do
    # Gets just the relative path that the redirect should point to
    # Example: /docs/databases/mariadb/how-to-install-mariadb-on-centos-7/
    redirect_target_path="/$(echo $line | egrep -o '<title>https:\/\/.*\/<\/title>' | cut -c 27- | rev | cut -c 9- | rev)"
    # Gets the file that the redirect is done from
    # Example: /guides/how-to-install-mariadb-on-centos-7/index.html
    redirect_from_path="$(echo $line | cut -d ':' -f 1 | cut -c 10-)"

    echo "Redirecting /docs$redirect_from_path to $redirect_target_path"
    s3cmd put --add-header=x-amz-website-redirect-location:$redirect_target_path ../public$redirect_from_path s3://linodedocs-latestrelease/docs$redirect_from_path -P --no-preserve
done