nginx_service:
  service.running:
    - name: nginx
    - enable: True
    - require:
      - file: nginx_symlink
    - watch:
      - file: nginx_config