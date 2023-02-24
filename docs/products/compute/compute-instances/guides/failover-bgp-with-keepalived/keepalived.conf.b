global_defs {
    enable_script_security
}
vrrp_script check_for_file {
    script "/etc/keepalived/check.sh"
    interval 5
    fall 2
    rise 2
}
vrrp_instance example_instance {
    state BACKUP
    nopreempt
    interface eth0
    virtual_router_id 10
    priority 99
    advert_int 1
    track_script {
        check_for_file
    }
    authentication {
        auth_type PASS
        auth_pass dT409gtNjMiS
    }
    unicast_src_ip 198.51.100.49
    unicast_peer {
    	192.0.2.173
    }
    virtual_ipaddress {
        203.0.113.57/32 dev lo
    }
    notify_master "/etc/keepalived/notify.sh Master"
    notify_backup "/etc/keepalived/notify.sh Backup"
    notify_fault "/etc/keepalived/notify.sh Fault"
}