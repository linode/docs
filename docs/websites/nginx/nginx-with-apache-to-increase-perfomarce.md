## Apache e Nginx juntos 

Nãoooo tire o apache! Entenda uma coisa é sabido que o Nginx é mais rápido do que
o apache como Web server, mas pense o seguinte você tem várias configurações no seu
.htaccess e Virtual Host's. Isso vai dar um trabalho a mais se migrar cada site 
para o Nginx e abandonar o Apache, até parece que isso é um desejo que arde no fundo da alma mas resista.
Para não perder tempo fazendo retrabalho a solução para isso é a divisão de tarefas que será realizada
entre o Nginx e o Apache. O Nginx vai cuidar da parte de páginas estáticas, arquivos, cache e requisições, enquanto
o Apache irá cuidar da parte de conteúdo dinâmico. O Apache faz isso sozinho? Sim, claro! Mas o Nginx faz melhor!
Poderiamos deixar somente o Nginx... Mas como a intenção é aproveitar o que podemos do Apache.

Bom sem mais delongas segue o que será feito.

Minha distro no atual momento é o Debian 8 Jessie

## Instalando o Apache e o Nginx

1) Abrir o terminal de comando

2.a) Logar como root no terminal com o comando su e coloque a senha do administrador

2.b) Checar se o Apache e o Nginx estão instalado com esses simples comandos

# apache2 -v  (esse comando vai retornar as seguintes informações)
Server Version: Apache/2.4.10(Debian)
Server Built:   Aug 30 2015 21:52:23

As primeiras informações são a versão instalada do Apache que é a 2.4.10 e o sistema Operacional que é o Debian,
seguidas pela data que foi realizada a instalação do Apache nessa máquina

# nginx -v (esse comando só fala qual a versão do Nginx instalada)
nginx version:  nginx/1.6.2

2.c) Caso não aparece nenhuma informação ou a messagem de comando não encontrado vamos ter que fazer a instalação de ambos 
ou de somente um.

De ambos: 

# aptitude install apache2 nginx

Do Apache: 

# aptitude install apache2

Do Nginx:

# aptitude install nginx

Ápos a instalação dos servidores siga os passos 2.a e 2.b para verificar se deu tudo certo!

Se não tiver nenhum site para mostrar no localhost então configure o banco de dados, configure e instale o Wordpress,
coloque os plugins essenciais nele, instale o tema desejado e insira conteúdo de texto, imagem e vídeo (lembre-se de usar conteúdo licenciado para uso livre).

## Requisitos mínimos para instalar o Wordpress

Confira os requisitos minímos para instalação do wordpress no 
localhost, os requisitos são o Apache, o Mysql e claro uma distro Linux
assim formando o LAMP(Linux, Apache, Mysql e PHP) e com o nginx formamos o LEMP(Linux, Enginex, Mysql e PHP). A pronuncia da palavra nginx é [Engine x]por isso que tem forma-se o LEMP. 

# apache2 -v
Server Version: Apache/2.4.10(Debian)
Server Built:   Aug 30 2015 21:52:23

# nginx -v
nginx version:  nginx/1.6.2

# mysql -V
mysql Ver 14.14 Distrib 5.5.44, for debian-linux-gnu (i686) using readline 6.3

# php -v
PHP 5.6.13 built: Set 8 2015 12:31:31
Zend v2.6.0
    Zend OPcache v7.0.6

Tudo certo! Mas não foi mencionado uma coisa importante o LAMP executado ele está rodando dentro de uma máquina virtual e o hospedeiro dessa máquina é um IMAC com MAC Yoshemite(10.10.3).

Crie o arquivo info.php com o conteúdo <?php phpinfo();?>
Salve na raíz do seu servidor apache no caso da máquina /var/www/html,
podendo variar conforme distro do Linux ou até mesmo um diretório personalizado.

Abra o navegador (aqui no caso é o iceweasel 38.2.1) e acessa com a URL localhost apenas. Deve ser exibido um relatório do PHP, se der algo como
servidor não encontrado ou não for exibido esse relatório no terminal digite:

# service apache2 restart

Aguarde alguns instantes e tente novamente se apresentar o mesmo problema, é
aconselhável rever as configurações do Apache.

## Instalando o Wordpress

1. Entre no site http://www.wordpress.org/downloads e faça o download da última versão do wordpress
2. Descompacte o arquivo .zip
3. No caso vamos mover a pasta wordpress para o diretório  `/var/www/html`
4. Abra o terminal, execute o mysql e logue-se no mesmo
5. Crie um banco de dados para o wordpress, por exemplo, nginxapache com o comando CREATE DATABASE nginxapache

### Cuidado o Mysql é case sensitive cria-se o banco com o nome de NginxApache, será esse nome a ser usado em todos lugares que precise dele, a mesma coisa com NGINXAPACHE ou nginxapache.

6. Editar o arquivo wp-config-sample.php que está no diretório `\var\wwww\html\wordpress`. Você pode renomear a pasta wordpress para o nome do site
    
    /** The name of the database for WordPress */
    define('DB_NAME', 'nginxapache');

    /** MySQL database username */
    define('DB_USER', 'qual_usuário);
    ** qual_usuário = qual usuário administra o banco de dados

    /** MySQL database password */
    define('DB_PASSWORD', 'qual_senha');
     ** qual_senha = qual senha deste usuário que administra o banco de dados

    /** MySQL hostname */
    define('DB_HOST', 'localhost');

 7. Salve o arquivo no mesmo diretório porém com o nome de wp-config.php
 8. Abra o navegador e entre no caso em http://localhost/wordpress que aparecerá a tela de instalação do worpress
 9. 












