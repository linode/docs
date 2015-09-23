## Dividindo tarefas entre o Nginx e o Apache 

Olá! Eu sou Margot Paon Garcia, tenho 30 anos, sou analista de sistemas focada em desenvolvimento frontend há 4 anos, trabalho e moro na cidade de São Paulo, no estado de São Paulo, no Brasil e sou Brasileira.

O foco desse artigo é a melhora da perfomance dos servidor **Apache**, utilizando o servidor **Nginx** como servidor de proxy reverso para armazenar cache e arquivos estáticos(**Frontend**) e o Apache cuidará da parte dinâmica do site e conexões com bancos de dados (**Backend**).

O que é?

_Apache_ 

Quando acessamos um site é criada uma requisição que é enviada para o servidor que o site está rodando, assim realizando um processamento baseado nessa requisição e responde a solicitação de um serviço. Um servidor Web é um computador em uma rede que sua função é de oferecer serviços a outros computadores(hosts) e nesse caso está sendo oferecido um acesso a um site.

Sendo o Apache o servidor web mais usado no mundo cerca de 66% segundo a **NETCRAFT**

- Criador Rob McCool na National Center of Supercomputing Applications (NCSA) em 1995
- A origem da Fundação Apache (Apache Foundation) vem daí: Brian Behlendorf e Cliff Skolnick retomaram o projeto de Rob McCool depois de sua saída da NCSA
-  Brian e Cliff passaram a controlar "patches" (adição de recursos ou correções)
-  O nome da fundação parece ter sido baseado nessa característica (uso de patches), já que pode ser interpretado como um trocadilho com a expressão em inglês "a patchy". Mas o nome vem de uma tribo norte americana chamada Apache.
- O Shambhala foi uma mudança importantíssima no apache pois ele é uma arquitetura que melhor e muito o gerenciamento de memória do apache. Foi criado por Robert Thau
- Software livre o que significa que qualquer um pode estudar ou alterar seu código-fonte, além de poder utilizá-lo gratuitamente.
- Disponivel para Linux, (Sistemas baseados em Unix), MAC OS, Windows, OS/2 e Novell Netware
- Executa código em PHP, Perl, Shell Script, ASP, Python, Ruby
- Protocolos HTTP, FTP, POP, SMTP
- process-based web server
- Segurança com SSL -> _HTTP_ + _SSL_ = **HTTPS**

_Nginx_

- (pronounced "engine x")
- Gratuito
- OpenSource
- Servidor HTTP de alta perfomance
- proxy reverso
- IMAP/POP3
- Baixo consumo de recursos
- Arquitetura Asincrona para respostas de requisições
- Configuração simples
- É rico em quantidade de funcionalidades 
- Escrito por Igor Sysoev desde 2005
- event-based web server
- Disponivel para Linux, Windows, MAC OS (via homebrew)
- As configurações do Nginx podem ser combinadas com códigos da linguagem <i>LUA</i>


Quais são seus papéis nesse artigo?

_Apache_

Backend

_Nginx_

Frontend

Comparativos entre um e o outro?
    
    {: .note}
    >
    > Os dois são <b>OPENSOURCE</b>

Bom sem mais delongas segue o que será feito.

Minha distro no atual momento é o _**Debian 8 Jessie**_

-------

## Instalando o Apache e o Nginx

1. Abrir o terminal de comando

2. Logar _como root no terminal_ com o comando `su `e coloque 
a senha do administrador

3. Checar se o **Apache e o Nginx estão instalados** com esses simples comandos

    Apache: <br/>
        #apache2 -v (esse comando vai retornar as seguintes informações) <br/>
        Server Version: Apache/2.4.10(Debian) <br/>
        Server Built:   Aug 30 2015 21:52:23 <br/>

        {: .note}
            >
            > As primeiras informações são a versão instalada do Apache
            > que é a 2.4.10 e o sistema Operacional que é o Debian, seguidas pela data
            > que foi realizada a instalação do Apache nessa máquina

    Nginx: <br/>
        #nginx -v(esse comando só fala qual a versão do Nginx instalada) <br/>
        nginx version:  nginx/1.6.2 <br/>

        {: .caution}
            >
            > Caso não aparece nenhuma informação ou a messagem de comando não encontrado
            > vamos ter que fazer a instalação de ambos ou de somente um.

De ambos: 

`#aptitude install apache2 nginx`

Do Apache: 

`#aptitude install apache2`

Do Nginx:

`#aptitude install nginx`

    {: .note}
        >Ápos a instalação dos servidores siga os passos 2.a e 2.b para verificar
        se deu tudo certo! Se não tiver nenhum site para mostrar no localhost
        então configure o banco de dados, configure e instale o Wordpress, coloque
        os plugins essenciais nele, instale o tema desejado e insira conteúdo
        de texto, imagem e vídeo (lembre-se de usar _**conteúdo licenciado**_ para uso livre).

--------

## Requisitos mínimos para instalar o Wordpress

Confira os requisitos minímos para instalação do wordpress no 
localhost, os requisitos são o Apache, o Mysql e claro uma distro Linux
assim formando o LAMP(Linux, Apache, Mysql e PHP) e com o nginx
formamos o LEMP(Linux, Enginex, Mysql e PHP). A pronuncia da palavra
nginx é [Engine x]por isso que tem forma-se o LEMP. 
    
    Apache: <br/>
        #apache2 -v <br/>
        Server Version: Apache/2.4.10(Debian) <br/>
        Server Built:   Aug 30 2015 21:52:23 <br/>
    
    Nginx: <br/>
        #nginx -v <br/>
        nginx version:  nginx/1.6.2 <br/>

    MYSQL: <br/>
        #mysql -V <br/>
        mysql Ver 14.14 Distrib 5.5.44, for debian-linux-gnu (i686) using readline 6.3 <br/>
    
    PHP: <br/>
        #php -v <br/>
        PHP 5.6.13 built: Set 8 2015 12:31:31 <br/>
        Zend v2.6.0 <br/>
            Zend OPcache v7.0.6 <br/>
    
    {: .note}
        >
        >Tudo certo! Mas não foi mencionado uma coisa importante o LAMP e o
        LEMP são executados dentro de uma máquina virtual e o 
        hospedeiro dessa máquina é um IMAC com MAC Yoshemite(10.10.3).

Crie o arquivo info.php com o conteúdo `<?php phpinfo();?>`
Salve na raíz do seu servidor apache no caso da máquina `/var/www/html`,
podendo variar conforme distro do Linux ou até mesmo um diretório personalizado.

Abra o navegador (aqui no caso é o iceweasel 38.2.1) e acesse
com a URL localhost apenas. Deve ser exibido um relatório do PHP, se der algo
como servidor não encontrado ou não for exibido esse relatório no terminal digite:

    Restart_Apache:
        #service apache2 restart

Aguarde alguns instantes e tente novamente se apresentar o mesmo problema, é
aconselhável rever as configurações do Apache.

----------

## Instalando o Wordpress

1. Entre no site http://www.wordpress.org/downloads e faça o download da
   última versão do wordpress
2. Descompacte o `arquivo .zip`
3. No caso vamos mover a pasta wordpress para o diretório  `/var/www/html`
4. Abra o terminal, <i>execute o mysql e logue-se no mesmo</i>
5. Crie um banco de dados para o wordpress, por exemplo, nginxapache
   com o comando <b>CREATE DATABASE nginxapache</b>

        {: .caution}
            >
            >Cuidado o Mysql é case sensitive cria-se o banco com o nome de
            NginxApache, será esse nome a ser usado em todos lugares que 
            precise dele, a mesma coisa com NGINXAPACHE ou nginxapache.

6. Editar o arquivo wp-config-sample.php que está no diretório 
`\var\wwww\html\wordpress`. 
Você pode renomear a pasta wordpress para o nome do site, por exemplo,
`\var\www\html\meusite\`
        
        {: .file}
        :   ~~~ conf
    
            /** The name of the database for WordPress */
            define('DB_NAME', 'nginxapache');

            /** MySQL database username */
            define('DB_USER', 'qual_usuário);
            //qual_usuário = qual usuário administra o banco de dados

            /** MySQL database password */
            define('DB_PASSWORD', 'qual_senha');
            ** qual_senha = qual senha deste usuário que administra o banco de dados

            /** MySQL hostname */
            define('DB_HOST', 'localhost');

            ~~~

 7. Salve o arquivo no mesmo diretório porém com o nome de wp-config.php
 8. Abra o navegador e entre no caso em `http://localhost/wordpress` que aparecerá
 a tela de instalação do worpress
 9. Instale e configure um tema e pelo menos 7 plugins (que você encontra em 
 qualquer top 10 para plugins e ou temas para o Wordpress)
 10. Crie 5 páginas, cada uma com 3 imagens de pelo menos 1024 X 768 e um texto
 com no minimo 10 paragrafos (em torno de 1000 palavras)

-----------

## Configurando o Ngnix como servidor de cache e proxy reverso (otimizando o Front-end do site) 

A coisa séria começa agora vamos editar o arquivo de configuração do Nginx para
que ele sirva de servidor de cache, um proxy reverso para se comunicar com o Apache
e otimizar o Front-end do site.

Abra o arquivo de configuração do nginx que se encontra `/etc/nginx/nginx.conf` com seu editor de
texto favorito

>user       www www;  ## Default: nobody
worker_processes  5;  ## Default: 1
error_log  logs/error.log;
pid        logs/nginx.pid;
worker_rlimit_nofile 8192;

>events {
  worker_connections  4096;  ## Default: 1024
}

>http {
  include    conf/mime.types;
  include    /etc/nginx/proxy.conf;
  include    /etc/nginx/fastcgi.conf;
  index    index.html index.htm index.php;

    >default_type application/octet-stream;
    log_format   main '$remote_addr - $remote_user [$time_local]  $status '
    '"$request" $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log   logs/access.log  main;
    sendfile     on;
    tcp_nopush   on;
    server_names_hash_bucket_size 128; # this seems to be required for some vhosts

    >server { # php/fastcgi
        listen       80;
        server_name  domain1.com www.domain1.com;
        access_log   logs/domain1.access.log  main;
        root         html;

        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:1025;
        }
    }

    >server { # simple reverse-proxy
        listen       80;
        server_name  domain2.com www.domain2.com;
        access_log   logs/domain2.access.log  main;

        # serve static files
        location ~ ^/(images|javascript|js|css|flash|media|static)/  {
        root    /var/www/virtual/big.server.com/htdocs;
        expires 30d;
    }

    # pass requests for dynamic content to rails/turbogears/zope, et al
    location / {
      proxy_pass      http://127.0.0.1:8080;
    }
>}

    >upstream big_server_com {
        server 127.0.0.3:8000 weight=5;
        server 127.0.0.3:8001 weight=5;
        server 192.168.0.1:8000;
        server 192.168.0.1:8001;
    }

    >server { # simple load balancing
        listen          80;
        server_name     big.server.com;
        access_log      logs/big.server.access.log main;

        location / {
            proxy_pass      http://big_server_com;
        }
    }
}

-----------

## Apache e manipulação de dados dinâmicos

