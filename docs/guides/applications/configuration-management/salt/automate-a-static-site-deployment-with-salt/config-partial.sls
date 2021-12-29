hugo_group:
  group.present:
    - name: {{ pillar['hugo_deployment_data']['group'] }}

hugo_user:
  user.present:
    - name: {{ pillar['hugo_deployment_data']['user'] }}
    - gid: {{ pillar['hugo_deployment_data']['group'] }}
    - home: {{ pillar['hugo_deployment_data']['home_dir'] }}
    - createhome: True
    - require:
      - group: hugo_group

hugo_site_repo:
  cmd.run:
    - name: git clone --recurse-submodules https://github.com/{{ pillar['hugo_deployment_data']['github_account'] }}/{{ pillar['hugo_deployment_data']['site_repo_name'] }}.git
    - cwd: {{ pillar['hugo_deployment_data']['home_dir'] }}
    - runas: {{ pillar['hugo_deployment_data']['user'] }}
    - creates: {{ pillar['hugo_deployment_data']['home_dir'] }}/{{ pillar['hugo_deployment_data']['site_repo_name'] }}
    - require:
      - pkg: git_pkg
      - user: hugo_user

nginx_default:
  file.absent:
    - name: '/etc/nginx/sites-enabled/default'
    - require:
      - pkg: nginx_pkg

nginx_config:
  file.managed:
    - name: /etc/nginx/sites-available/hugo_site
    - source: salt://hugo/files/hugo_site
    - user: root
    - group: root
    - mode: 0644
    - template: jinja
    - require:
      - pkg: nginx_pkg

nginx_symlink:
  file.symlink:
    - name: /etc/nginx/sites-enabled/hugo_site
    - target: /etc/nginx/sites-available/hugo_site
    - user: root
    - group: root
    - require:
      - file: nginx_config

nginx_document_root:
  file.directory:
    - name: {{ pillar['hugo_deployment_data']['nginx_document_root'] }}/{{ pillar['hugo_deployment_data']['site_repo_name'] }}
    - user: {{ pillar['hugo_deployment_data']['user'] }}
    - group: {{ pillar['hugo_deployment_data']['group'] }}
    - dir_mode: 0755
    - require:
      - user: hugo_user

build_script:
  file.managed:
    - name: {{ pillar['hugo_deployment_data']['home_dir'] }}/deploy.sh
    - source: salt://hugo/files/deploy.sh
    - user: {{ pillar['hugo_deployment_data']['user'] }}
    - group: {{ pillar['hugo_deployment_data']['group'] }}
    - mode: 0755
    - template: jinja
    - require:
      - user: hugo_user
  cmd.run:
    - name: ./deploy.sh
    - cwd: {{ pillar['hugo_deployment_data']['home_dir'] }}
    - runas: {{ pillar['hugo_deployment_data']['user'] }}
    - creates: {{ pillar['hugo_deployment_data']['nginx_document_root'] }}//{{ pillar['hugo_deployment_data']['site_repo_name'] }}/index.html
    - require:
      - file: build_script
      - cmd: hugo_site_repo
      - file: nginx_document_root