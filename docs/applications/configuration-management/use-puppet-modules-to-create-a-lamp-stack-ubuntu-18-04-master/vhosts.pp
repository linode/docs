class apache::vhosts {

  if $::osfamily == 'RedHat' {
    file { '/etc/httpd/conf.d/vhost.conf':
      ensure    => file,
      content   => template('apache/vhosts-rh.conf.erb'),
      notify    => Service['apache-service'],
    }
    file { [ "/var/www/$servername",
             "/var/www/$servername/public_html",
             "/var/www/$servername/logs", ]:
      ensure    => directory,
    }
  } elsif $::osfamily == 'Debian' {
    file { [ "/var/www/$servername",
             "/var/www/$servername/public_html",
             "/var/www/$servername/logs", ]:
      ensure    => directory,
    }
    file { "/etc/apache2/sites-available/$servername.conf":
      ensure    => file,
      content   => template('apache/vhosts-deb.conf.erb'),
      notify    => Service['apache-service'],
    }
    file { "/etc/apache2/sites-enabled/$servername.conf":
      ensure    => 'link',
      target    => "/etc/apache2/sites-available/$servername.conf",
      notify    => Service['apache-service'],
  }
  } else {
    fail ( 'This is not a supported distro.')
  }

}