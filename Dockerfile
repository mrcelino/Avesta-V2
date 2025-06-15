FROM php:8.2-fpm

# Install dependencies dan unzip (untuk composer)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install zip pdo pdo_mysql

# Install composer globally
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

WORKDIR /var/www/html

COPY . .

# Jalankan composer install setelah composer terinstall
RUN composer install --no-dev --optimize-autoloader

CMD ["php-fpm"]
