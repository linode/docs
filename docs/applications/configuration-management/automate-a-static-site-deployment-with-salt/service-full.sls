nginx_service:
  service.running:
    - name: nginx
    - enable: True
    - require:
      - file: nginx_symlink
    - watch:
      - file: nginx_config

webhook_service:
  service.running:
    - name: webhook
    - enable: True
    - watch:
      - file: webhook_config
      - module: webhook_systemd_unit