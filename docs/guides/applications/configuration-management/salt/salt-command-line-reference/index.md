---
slug: salt-command-line-reference
description: 'The SaltStack is a powerful configuration management tool. This guide provides you with a reference for the SaltStack command line interface.'
keywords: ['salt','saltstack','cli','command line','reference']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-03
modified: 2019-01-02
modified_by:
  name: Linode
title: "SaltStack Command Line Reference"
external_resources:
- '[SaltStack Command Line Documentation](https://docs.saltproject.io/en/latest/ref/cli/index.html)'
- '[Linode Cloud Module](https://docs.saltproject.io/en/latest/ref/clouds/all/salt.cloud.clouds.linode.html)'
aliases: ['/applications/configuration-management/salt-command-line-reference/','/applications/configuration-management/salt/salt-command-line-reference/']
tags: ["automation","salt"]
authors: ["Andy Stevens"]
---

[SaltStack](https://github.com/saltstack/salt) is a powerful configuration management tool. The following is a quick-reference guide for Salt's command line interface (CLI).

## salt

Used to issue commands to minions in parallel. `salt` allows you to both control and query minions.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt -c /home/salt/conf test.ping`|
|`-s`, `--static`|Only return data after all minions have returned.|`salt --static`|
|`--async`|Instead of waiting for a job on a minion or minions, print the job ID and the job completion.|`salt '*' pkg.install apache2 --async`|
|`--subset`|Execute commands on a random subset of minions.|`salt '*' telegram.post_message message="Hello random 3!" --subset 3`|
|`-v`, `--verbose`|Print extra data, such as the job ID.|`salt 'minion1' user.add steve --verbose`|
|`--hide-timeout`|Only print minions that can be reached.|`salt '*' test.ping --hide-timeout`|
|`-b`, `--batch-size`|Execute on a batch or percentage of minions.|`salt '*' test.ping --batch-size 25%`|
|`-a`, `--auth`|Use an external authentication medium. You will be prompted for credentials. Options are `auto`, `keystone`, `ldap`, and `pam`. Can be used with `-T`.|`salt -a pam '*' status.meminfo`|
|`-T`, `--make-token`|Used with `-a`. Creates an authentication token in the active user's home directory that has a default 12 hour expiration time. Token expiration time is set in the Salt master config file.|`salt -T -a pam '*' status.cpuinfo`|
|`--return`|Used to select an alternative returner. Options are `carbon`, `cassandra`, `couchbase`, `couchdb`, `elasticsearch`, `etcd`, `hipchat`, `local`, `local_cache`, `memcache`, `mongo`, `mysql`, `odbc`, `postgres`, `redis`, `sentry`, `slack`, `sms`, `smtp`, `sqlite3`, `syslog`, and `xmpp`.|`salt '*' status.all_status --return mongo`|
|`-d`, `--doc`, `--documentation`|Return all available documentation for a module function, or all functions if one is not provided.|`salt 'minion3' service.available -d`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt 'minion2' state.apply -l info`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/master`|`salt '*' test.ping --log-file /home/salt/log`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt '*' test.ping --log-level all`|
|`-E`, `--pcre`|Target expression will be interpreted as a Perl Compatible Regular Expression (PCRE) rather than a shell glob.|`salt -E 'minion[0-9]' service.reload apache2`|
|`-L`, `--list`|Target expression will be interpreted as a comma-delimited list.|`salt -L 'minion1,minion2' service.show sshd`|
|`-G`, `--grain`|Target expression in the form of a glob expression matches a Salt grain. &lt;grain value&gt;:&lt;glob expression&gt;.|`salt -G 'os:Ubuntu' service.available mysql`|
|`--grain-pcre`|Target expression in the form of a Perl Compatible Regular Expression matches values returned by Salt grains on the minion.&lt;grain value&gt;:&lt;regular expression&gt;|`salt --grain-pcre 'os:Arch' service.restart apache2`|
|`-I`, `--pillar`| Use pillar values instead of shell globs to identify targets.|`salt -I 'role:production' test.echo 'playback'`|
|`--out`| Choose an alternative outputter to display returned data. Available outputters are: `grains`, `highstate`, `json`, `key`, `overstatestage`, `pprint`, `raw`, `txt`, `yaml`. Note: when using `--out json` you will probably want to also use `--static`.| `salt '*' test.version --out json --static`|


## salt-call

Runs module functions on a minion instead of the master. It is used to run a standalone minion.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-call --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-call -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-call -c /home/salt/conf test.ping`|
|`-g`, `--grains`|Get the information generated by the Salt grains.|`salt-call --grains`|
|`-m`, `--module-dirs`|Select an additional modules directory. You can provide this option multiple times for multiple directories.|`salt-call -m /home/salt/modules1 -m /home/salt/modules2`|
|`-d`, `--doc`, `--documentation`|Return all available documentation for module function, or all functions if one is not provided.|`salt-call system.get_system_time -d`|
|`--master`|Choose which master to use. The minion must be authenticated with the master. If the master is omitted, the first master in the minion config will be used.|`salt-call --master master1`|
|`--return`|Used to select an alternative returner. Options are `carbon`, `cassandra`, `couchbase`, `couchdb`, `elasticsearch`, `etcd`, `hipchat`, `local`, `local_cache`, `memcache`, `mongo`, `mysql`, `odbc`, `postgres`, `redis`, `sentry`, `slack`, `sms`, `smtp`, `sqlite3`, `syslog`, and `xmpp`.|`salt-call --return mongo status.all_status`|
|`--local`|Run Salt as if there was no master running.|`salt-call --local system.get_system_time`|
|`--file-root`|Set a directory as the base file directory.|`salt-call --file-root /home/salt`|
|`--pillar-root`|Set a directory as the base pillar directory.|`salt-call --file-root /home/salt/pillar`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-call -l all test.exception 'oh no!'`|
|`--log-file`|Change log file path. Defaults to `/var/log/salt/minion`.|`salt-call --logfile /home/salt/log/minion test.exception 'oh no!'`|
|`--log-file-level`|Change logfile log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-call --log-file-level all test.exception 'oh no!'`|
|`--out`| Choose an alternative outputter to display returned data. Available outputters are: `grains`, `highstate`, `json`, `key`, `overstatestage`, `pprint`, `raw`, `txt`, `yaml`.| `salt-call test.version --out json`|

## salt-cloud

Used to provision virtual machines on public clouds with Salt.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-cloud --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-cloud -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-cloud -c /home/salt/conf`|
|`-a`, `--action`|Perform a cloud provider specific action. Requires an instance.|`salt-cloud -a reboot testlinode`|
|`-f`, `--function`|Perform a cloud provider specific function that does not apply to an instance. Requires a provider.|`salt-cloud -f clone my-linode-config linode_id=1234567 datacenter_id=2 plan_id=5`|
|`-p`, `--profile`|Choose a profile from which to build cloud VMs.|`salt-cloud -p linode-1024 mynewlinode`|
|`-m`, `--map`|Choose a map file from which to create your VMs. If a VM exists it will be skipped.|`salt-cloud -m /path/to/map`|
|`-H`, `--hard`|Used when creating VMs with a map file. If set, will destroy all VMs not listed in the map file.|`salt-cloud -m /path/to/map -H`|
|`-d`, `--destroy`|Destroy the named VMs. Can be used with `-m` to provide a map of VMs to destroy.|`salt-cloud -m /path/to/map -d`|
|`-P`, `--parallel`|Build VMs in parallel.|`salt-cloud -P -p linode-profile newlinode1 newlinode2`|
|`-u`, `--update-boostrap`|Update salt-bootstrap.|`salt-cloud -u`|
|`-y`, `--assume-yes`|Answer yes to all questions.|`salt-cloud -y -d linode1 linode2`|
|`-k`, `-keep-tmp`|Do not remove /tmp files.|`salt-cloud -k -m /path/to/map`|
|`--show-deploy-args`|Include deployment arguments in the return data.|`salt-cloud --show-deploy-args -m /path/to/map`|
|`--script-args`|Arguments to be passed to the bootstrap script when deploying.|`salt-cloud -m /path/to/map --script-args '-h'`|
|`-Q`, `--query`|Query nodes running on configured cloud providers.|`salt-cloud -Q`|
|`-F`, `--full-query`|Query VMs and print all available information. Can be used with -m to provide a map.|`salt-cloud -F`|
|`-S`, `--select-query`|Query VMs and print selected information. Can be used with -m to provide a map.|`salt-cloud -S`|
|`--list-providers`|Display a list of configured providers.|`salt-cloud --list-providers`|
|`--list-profiles`|Display a list of configured profiles. Supply a cloud provider, such as `linode`, or pass `all` to view all configured profiles.|`salt-cloud --list-profiles linode`|
|`--list-locations`|Display a list of available locations. Supply a cloud provider, such as `linode`, or pass `all` to view all location for configured profiles.|`salt-cloud --list-locations linode`|
|`--list-images`|Display a list of available images. Supply a cloud provider, such as `linode`, or pass `all` to view all images for configured profiles.|`salt-cloud --list-images linode`|
|`--list-sizes`|Display a list of available sizes. Supply a cloud provider, such as `linode`, or pass `all` to view all sizes for configured profiles.|`salt-cloud --list-sizes linode`|
|`--out`| Choose an alternative outputter to display returned data. Available outputters are: `grains`, `highstate`, `json`, `key`, `overstatestage`, `pprint`, `raw`, `txt`, `yaml`.| `salt-call test.version --out json`|


## salt-cp

Used to copy files from the master to all Salt minions that match a specific target expression.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-cp --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-cp -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-cp '*' -c /home/salt/conf /file/to/copy /destination`|
|`-t`, `--timeout`|The amount of seconds to wait for replies from minions. The default is 5 seconds.|`salt-cp '*' -t 25 /file/to/copy /destination`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-cp '*' -l all /file/to/copy /destination`|
|`--log-file`|Change log file path. Defaults to `/var/log/salt/master`.|`salt-cp '*' --logfile /home/salt/log/minion /file/to/copy /destination`|
|`--log-file-level`|Change logfile log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-cp '*' --log-file-level all /file/to/copy /destination`|
|`-E`, `--pcre`|Target expression will be interpreted as a Perl Compatible Regular Expression (PCRE) rather than a shell glob.|`salt-cp -E 'minion[0-9]' /file/to/copy /destination`|
|`-L`, `--list`| Target expression will be interpreted as a comma-delimited list.|`salt -L 'minion1,minion2' /file/to/copy /destination`|
|`-G`, `--grain`|Target expression matches a Salt grain. &lt;grain value&gt;:&lt;glob expression&gt;.|`salt -G 'os:Ubuntu' /file/to/copy /destination`|
|`--grain-pcre`|Target expression in the form of a Perl Compatible Regular Expression matches values returned by Salt grains on the minion.&lt;grain value&gt;:&lt;regular expression&gt;|`salt-cp --grain-pcre 'os:Arch' /file/to/copy /destination`|
|`-C`, `--chunked`|Use chunked mode to copy files. Supports large files, recursive directories copying and compression.|`salt-cp -C /some/large/file /destination`|
|`-n`, `--no-compression`|Disable gzip in chunked mode.|`salt-cp -C -n /some/large/file /destination`|

## salt-key

Used to manage the Salt server public keys.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-key --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-key -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-key -c /home/salt/conf`|
|`-u`, `--user`|Supply a user to run salt-key.|`salt-key --user steven`|
|`-q`, `--quiet`|Suppress output|`salt-key -q`|
|`-y`, `--yes`|Answer yes to all questions. Default is `False`.|`salt-key -y True`|
|`--rotate-aes-key`|Setting to `False` prevents the key session from being refreshed when keys are deleted or rejected. Default is `True`.|`salt-key --rotate-aes-key False`|
|`--log-file`|Change log file path. Defaults to `/var/log/salt/minion`.|`salt-key --logfile /home/salt/log/minion -D`|
|`--log-file-level`|Change logfile log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-key --log-file-level all --accept '*'`|
|`-l`, `--list`|List public keys. `pre`, `un`, and `unaccepted` will list unaccepted/unsigned keys. `acc` or `accepted` will list accepted/signed keys. `rej` or `rejected` will list rejected keys. `all` will list all keys.|`salt-key -l all`|
|`-a`, `--accept`|Accept a public key. Globs are supported.|`salt-key --accept 'minion*'`|
|`-A`, `--accept-all`|Accept all pending keys.|`salt-key -A`|
|`-r`, `--reject`|Reject a specific key. Globs are supported.|`salt-key -r 'minion*'`|
|`-R`, `--reject-all`|Reject all pending keys.|`salt-key -R`|
|`--include-all`|Include non-pending keys when accepting and rejecting.|`salt-key -r 'minion*' --include-all`|
|`-p`, `--print`|Print a public key.|`salt-key --print 'minion1'`|
|`-d`, `--delete`|Delete a public key. Globs are supported.|`salt-key -d 'minion*'`|
|`-D`, `--delete-all`|Delete all public keys.|`salt-key --delete-all -y`|
|`-f`, `--finger`|Print a key's fingerprint.|`salt-key --finger 'minion1'`|
|`-F`, `--finger-all`|Print all keys' fingerprints.|`salt-key --F`|
|`--gen-keys`|Set a name to generate a key-pair.|`salt-key --gen-keys newminion`|
|`--gen-keys-dir`|Choose where to save newly generated key-pairs. Only works with `--gen-keys`.|`salt-key --gen-keys newminion --gen-keys-dir /home/salt/keypairs`|
|`--keysize`|Set the keysize for a generated key. Must be a value of 2048 or higher. Only works with `--gen-keys`.|`salt-key --gen-keys newminion --keysize 4096`|
|`--gen-signature`|Create a signature for the master's public key named master_pubkey_signature. This requires a new-signing-keypair which can be created with the `--auto-create` option.|`salt-key --gen-signature --auto-create`|
|`--priv`|The private-key file with which to create a signature.|`salt-key --priv key.pem`|
|`--signature-path`|The file path for the new signature.|`salt-key  --gen-signature --auto-create --signature-path /path/to/signature`|
|`--pub`|The public-key file with which to create a signature.|`salt-key --gen-signature key.pub`|
|`--auto-create`|Auto-create a signing key-pair.|`salt-key --gen-signature --auto-create`|

## salt-master

A daemon used to control Salt minions.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-master --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-master -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-master -c /home/salt/conf`|
|`-u`, `--user`|Supply a user to run salt-master.|`salt-master --user steven`|
|`-d`, `--daemon`|Run salt-master as daemon.|`salt-master -d`|
|`--pid-file`|Specify the file path of the pidfile. Default is `/var/run/salt-master.pid`|`salt-master --pid-file /path/to/new/pid`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-master -l info`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/master`|`salt-master --log-file /home/salt/log`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt-master --log-level all`|

## salt-minion

A daemon that is controlled by a Salt master.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-minion --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-minion -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-minion -c /home/salt/conf`|
|`-u`, `--user`|Supply a user to run salt-minion.|`salt-minion --user steven`|
|`-d`, `--daemon`|Run salt-minion as daemon.|`salt-minion -d`|
|`--pid-file`|Specify the file path of the pidfile. Default is `/var/run/salt-minion.pid`|`salt-minion --pid-file /path/to/new/pid`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-master -l info`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/minion`|`salt-minion --log-file /home/salt/log`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt-minion --log-level all`|

## salt-run

Runs a Salt runner on a Salt master.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-run --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-run -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-run -c /home/salt/conf foo.bar`|
|`-t`, `--timeout`|The amount of seconds to wait for replies from minions. The default is 5 seconds.|`salt-run -t 25 foo.bar`|
|`-d`, `--doc`, `--documentation`|Return all available documentation for a module or runner.|`salt-run foo.bar -d`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-run -l info foo.bar`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/master`|`salt-minion --log-file /home/salt/log foo.bar`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt-minion --log-level all foo.bar`|

## salt-ssh

Use SSH transport to execute salt routines.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-ssh --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-ssh -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-ssh '*' -c /home/salt/conf test.ping`|
|`-r`, `--raw`, `--raw-shell`|Run a raw shell command.|`salt-ssh '*' -r echo 'test'`|
|`--roster`|Choose which roster system to use. The default is the flat file roster.|`salt-ssh '192.168.0.0/16' --roster scan pkg.install apache2`|
|`--roster-file`|Change the roster file directory. The default is the same directory as the master config file.|`salt-ssh 'minion1' --roster-file /path/to/roster test.ping`|
|`--refresh`, `--refresh-cache`|Use to force refresh the target's data in the master side cache before the auto refresh timeframe has been reached.|`salt-ssh 'minion1' --refresh-cache status.diskstats`|
|`--max-procs`|The number of minions to communicate with concurrently. In general, more connections mean faster communication. Default is 25.|`salt-ssh '*' --max-procs 50 test.ping`|
|`-v`, `--verbose`|Display job ID.|`salt-ssh '*' -v test.ping`|
|`-s`, `--static`|Return minion data as a grouping.|`salt-ssh '*' -s status.meminfo`|
|`-w`, `--wipe`|Remove Salt files when the job is done.|`salt-ssh '*' -w state.apply`|
|`-W`. `--rand-thin-dir`|Deploys to a random temp directory and cleans the directory when done.|`salt-ssh '*' -W state.apply`|
|`--python2-bin`|File path to a python2 binary which has Salt installed.|`salt-ssh '*' --python2-bin /file/to/bin test.ping`|
|`--python3-bin`|File path to a python3 binary which has Salt installed.|`salt-ssh '*' --python3-bin /file/to/bin test.ping`|
|`--jid`|Supply a job ID instead of generating one.|`salt-ssh '*' -v --jid 00000000000000000000 test.ping`|
|`--priv`|Supply which SSH private key to use for authentication.|`salt-ssh '*' --priv /path/to/privkey status.netstats`|
|`-i`, `--ignore-host-keys`|Disable StrictHostKeyChecking, which suppresses asking for connection approval.|`salt-ssh '*' -i pkg.install mysql-client`|
|`--no-host-keys`|Ignores SSH host keys. Useful if an error persists with `--ignore-host-keys`.|`salt-ssh '*' -i --no-host-keys pkg.install cowsay`|
|`--user`|Supply the user to authenticate with.|`salt-ssh '*' --user steven -r cowsay 'hello!'`|
|`--passwd`|Supply the password to authenticate with.|`salt-ssh 'minion2' --passwd p455w0rd system.reboot`|
|`--askpass`|Request a password prompt.|`salt-ssh 'minion1' --askpass sys.doc`|
|`--key-deploy`|Deploy the authorized SSH key to all minions.|`salt-ssh '*' --key-deploy --passwd test.ping`|
|`--sudo`|Run command with elevated privileges.|`salt-ssh '*' -r --sudo somecommand`|
|`--scan-ports`|A comma-separated list of ports to scan in the scan roster.|`salt-ssh '192.168.0.0/16' --roster scan --scan-ports 22,23 test.ping`|
|`--scan-timeout`|Timeout for scan roster.|`salt-ssh '192.168.0.0/16' --roster scan --scan-timeout 100 test.ping`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-ssh -l info test.ping`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/ssh`|`salt-ssh --log-file /home/salt/log test.ping`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt-ssh --log-level all test.ping`|
|`-E`, `--pcre`|Target expression will be interpreted as a Perl Compatible Regular Expression (PCRE) rather than a shell glob.|`salt-ssh -E 'minion[0-9]' service.reload apache2`|
|`--out`| Choose an alternative outputter to display returned data. Available outputters are: `grains`, `highstate`, `json`, `key`, `overstatestage`, `pprint`, `raw`, `txt`, `yaml`.| `salt-ssh '*' test.version --out json`|

## salt-syndic

A minion set up on a master that allows for passing commands in from a higher master.

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-syndic --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-syndic -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-syndic -c /home/salt/conf`|
|`-u`, `--user`|Supply a user to run salt-syndic.|`salt-syndic --user steven`|
|`-d`, `--daemon`|Run salt-syndic as daemon.|`salt-syndic -d`|
|`--pid-file`|Specify the file path of the pidfile. Default is `/var/run/salt-syndic.pid`|`salt-syndic --pid-file /path/to/new/pid`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-syndic -l info`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/master`|`salt-syndic --log-file /home/salt/log`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt-syndic --log-level all`|

## spm

Salt Package Manager

|Option|Description|Example|
|------|-----------|-------|
|`-y`, `--yes`|Answer yes to all questions.|`spm remove -y apache`|
|`-f`, `--force`|Force `spm` to perform an action it would normally refuse to perform.||
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`spm -l info install apache`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/spm`|`spm --log-file /home/salt/log install mysql`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`spm --log-level all remove nginx`|

|Command|Description|Example|
|-------|-----------|-------|
|`update_repo`|Update locally configured repository metadata.|`spm update_repo`|
|`install`|Install a package by name from a configured SPM repository.|`spm install nginx`|
|`remove`|Remove a package.|`spm remove apache`|
|`info`|Get an installed package's information.|`spm info mysql`|
|`files`|List an installed package's files.|`spm files mongodb`|
|`local`|Perform a command on a local package, not a package in a repository or an installed package. Does not work with `remove`.|`spm local install /path/to/package`|
|`build`|Build a package.|`spm build /path/to/package`|
|`create_repo`|Scan a directory for a valid SPM package and build an SPM-METADATA file in that directory.|`spm create_rep /path/to/package`|

## salt-api

Used to start the Salt API

|Option|Description|Example|
|------|-----------|-------|
|`--version`|Get the current version of Salt.|`salt-api --version`|
|`-h`, `--help`|Display Salt commands and help text.|`salt-api -h`|
|`-c`, `--config-dir`|Change the Salt configuration directory. The default is `/etc/salt`.|`salt-api -c /home/salt/conf`|
|`-u`, `--user`|Supply a user to run salt-api.|`salt-api --user steven`|
|`-d`, `--daemon`|Run salt-api as daemon.|`salt-api -d`|
|`--pid-file`|Specify the file path of the pidfile. Default is `/var/run/salt-api.pid`|`salt-api --pid-file /path/to/new/pid`|
|`-l`, `--log-level`|Change console log level. Defaults to `warning`. Available options are `all`, `garbage`, `trace`, `debug`, `info`, `warning`, `error`, and `quiet`.|`salt-api -l info`|
|`--log-file`|Change the log file path. Defaults to `/var/log/salt/api`|`salt-api --log-file /home/salt/log`|
|`--log-file-level`|Change the logging level of the log file. Same options as `--log-level`|`salt-api --log-level all`|
