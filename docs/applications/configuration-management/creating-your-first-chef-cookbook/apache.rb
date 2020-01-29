package "apache2" do
  action :install
end
service "apache2" do
  action [:enable, :start]
end
# Virtual Hosts Files

node["lamp_stack"]["sites"].each do |sitename, data|
  document_root = "/var/www/html/#{sitename}"

  directory document_root do
    mode "0755"
    recursive true
	end

  execute "enable-sites" do
    command "a2ensite #{sitename}"
    action :nothing
  end

  template "/etc/apache2/sites-available/#{sitename}.conf" do
    source "virtualhosts.erb"
    mode "0644"
    variables(
      :document_root => document_root,
      :port => data["port"],
      :serveradmin => data["serveradmin"],
      :servername => data["servername"]
    )
    notifies :run, "execute[enable-sites]"
    notifies :restart, "service[apache2]"
  end

  directory "/var/www/html/#{sitename}/public_html" do
    action :create
  end

  directory "/var/www/html/#{sitename}/logs" do
    action :create
  end

  #Apache Configuration

  execute "keepalive" do
    command "sed -i 's/KeepAlive On/KeepAlive Off/g' /etc/apache2/apache2.conf"
    action :run
  end

  execute "enable-prefork" do
    command "a2enmod mpm_prefork"
    action :nothing
  end

  cookbook_file "/etc/apache2/mods-available/mpm_prefork.conf" do
    source "mpm_prefork.conf"
    mode "0644"
    notifies :run, "execute[enable-prefork]"
  end
end
