Recomendaciones:

Para ejecutar el proyecto es necesario tener unas versiones iguales o parecidas: 
1- npm 6.14.11
2- Node v14.16.0


Una vez el proyecto este en la carpeta para ejecutarse ejecutar una ventana de comandos el siguiente comando:

npm install

El codigo de arduino esta en la carpeta conection, y la base de datos en la carpeta SQL

https://nodejs.org/es/    Link para instalar NodeJs

Para utilizar el proyecto es necesario tener activados los binarios de XAMPP, de la base de datos MariaDB(MYSQL),
con el siguiente codigo en la configuracion de la base de datos, el archivo "my.ini"

"""


[mysqld]
port=3306
socket="C:/xampp/mysql/mysql.sock"
basedir="C:/xampp/mysql"
tmpdir="C:/xampp/tmp"
datadir="C:/xampp/mysql/data"
pid_file="mysql.pid"
# enable-named-pipe
key_buffer=16M
max_allowed_packet=1M
sort_buffer_size=512K
net_buffer_length=8K
read_buffer_size=256K
read_rnd_buffer_size=512K
myisam_sort_buffer_size=8M
log_error="mysql_error.log"
log-bin=bin.log
log-bin-index=bin-log.index
max_binlog_size=100M
binlog_format=row
socket=mysql.soc



"""

