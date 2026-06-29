class apache::params {

  if $::osfamily == 'RedHat' {
    $apachename     = 'httpd'
    $conffile       = '/etc/httpd/conf/httpd.conf'
    $confsource     = 'puppet:///modules/apache/httpd.conf'
  } elsif $::osfamily == 'Debian' {
    $apachename     = 'apache2'
    $conffile       = '/etc/apache2/apache2.conf'
    $confsource     = 'puppet:///modules/apache/apache2.conf'
  } else {
    print "This is not a supported distro."
  }

}
