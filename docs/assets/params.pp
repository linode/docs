class apache::params {

  if $::osfamily == 'RedHat' {
    $updatesys	  = 'yum update -y'
    $apachename	  = 'httpd'
    $conffile	  = '/etc/httpd/conf/httpd.conf'
    $confsource	  = 'puppet:///modules/apache/httpd.conf'
  } elsif $::osfamily == 'Debian' {
    $updatesys	  = 'sudo apt-get update && sudo apt-get upgrade -y'
    $apachename	  = 'apache2'
    $conffile	  = '/etc/apache2/apache2.conf'
    $confsource	  = 'puppet:///modules/apache/apache2.conf'
  } else {
    print "This distro is not supported."
  }

}