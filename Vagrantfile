Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64" # Ubuntu 22.04 

  config.vm.hostname = "gotaxi.local"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.network "public_network"

config.vm.provision "shell", inline: <<-SHELL
  sudo apt-get update
  sudo apt-get install -y software-properties-common lsb-release ca-certificates apt-transport-https

  # Agrega el repositorio de PHP 8.2
  sudo add-apt-repository ppa:ondrej/php -y
  sudo apt-get update

  # Instala PHP 8.2 y Apache
  sudo apt-get install -y php8.2 php8.2-cli php8.2-common php8.2-mbstring php8.2-xml php8.2-mysql php8.2-curl php8.2-bcmath php8.2-zip unzip curl apache2 libapache2-mod-php8.2

  # Configura Apache
  sudo a2enmod rewrite
  sudo systemctl restart apache2

  # Crea directorio y permisos
  sudo mkdir -p /var/www/gotaxi
  sudo chown -R vagrant:vagrant /var/www/gotaxi
  ln -fs /vagrant /var/www/gotaxi

  # VirtualHost
  echo '<VirtualHost *:80>
      ServerName www.GoTaxi
      DocumentRoot /var/www/gotaxi/public
      <Directory /var/www/gotaxi/public>
          AllowOverride All
          Require all granted
      </Directory>
  </VirtualHost>' | sudo tee /etc/apache2/sites-available/gotaxi.conf

  sudo a2ensite gotaxi
  sudo systemctl reload apache2
SHELL


  config.vm.synced_folder ".", "/vagrant", owner: "www-data", group: "www-data", mount_options: ["dmode=775", "fmode=664"]
end

