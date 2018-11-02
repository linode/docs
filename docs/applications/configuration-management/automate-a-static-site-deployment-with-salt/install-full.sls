nginx_pkg:
  pkg.installed:
    - name: nginx

git_pkg:
  pkg.installed:
    - name: git

hugo_pkg:
  pkg.installed:
    - name: hugo
    - sources:
      - hugo: https://github.com/gohugoio/hugo/releases/download/v{{ pillar['hugo_deployment_data']['hugo_version'] }}/hugo_{{ pillar['hugo_deployment_data']['hugo_version'] }}_Linux-64bit.deb

webhook_pkg:
  pkg.installed:
    - name: webhook