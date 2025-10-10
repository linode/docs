class apache (
  $updatesys    = $::apache::params::updatesys,
  $apachename   = $::apache::params::apachename,
  $conffile   = $::apache::params::conffile,
  $confsource = $::apache::params::confsource,
) inherits ::apache::params {

#  exec { 'update system':
#    command   => $updatesys,
#    path      => '/usr/bin'
#  }

  package { 'apache':
    name    => $apachename,
    ensure  => present,
  }

  file { 'configuration-file':
    path    => $conffile,
    ensure  => file,
    source  => $confsource,
    notify  => Service['apache-service'],
  }

  service { 'apache-service':
    name	  => $apachename,
    hasrestart	  => true,
  }

}