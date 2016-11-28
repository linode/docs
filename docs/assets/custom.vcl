vcl 4.0;

backend default {
.host = "localhost";
.port = "8080";
}

acl purger {
"localhost";
"203.0.113.100";
"2001:DB8:0000:0000:0000:1234";
}

sub vcl_recv {

 if (client.ip != "127.0.0.1" && req.http.host ~ "example-over-https.com") {
    set req.http.x-redir = "https://www.example-over-https.com" + req.url;
    return(synth(850, ""));
 }

 if (req.method == "PURGE") {
    if (!client.ip ~ purger) {
    return(synth(405, "This IP is not allowed to send PURGE requests."));
  }
 return (purge);
 }

 if (req.restarts == 0) {
    if (req.http.X-Forwarded-For) {
    set req.http.X-Forwarded-For = client.ip;
    }
 }

 if (req.http.Authorization || req.method == "POST") {
    return (pass);
 }

 if (req.url ~ "/feed") {
    return (pass);
 }

 if (req.url ~ "wp-admin|wp-login") {
    return (pass);
 }

 set req.http.cookie = regsuball(req.http.cookie, "wp-settings-\d+=[^;]+(; )?", "");
 set req.http.cookie = regsuball(req.http.cookie, "wp-settings-time-\d+=[^;]+(; )?", "");

 if (req.http.cookie == "") {
 unset req.http.cookie;
 }
}

sub vcl_synth {
 if (resp.status == 850) {  
     set resp.http.Location = req.http.x-redir;       
     set resp.status = 302;
     return (deliver);
 }
}

sub vcl_purge {
 set req.method = "GET";
 set req.http.X-Purger = "Purged";
 return (restart);
}

sub vcl_backend_response {
 set beresp.ttl = 24h;
 set beresp.grace = 1h;

 if (bereq.url !~ "wp-admin|wp-login|product|cart|checkout|my-account|/?remove_item=") {
 unset beresp.http.set-cookie;    
 }
}

sub vcl_deliver {
 if (req.http.X-Purger) {
    set resp.http.X-Purger = req.http.X-Purger;
 }
}