# Todo App

An inventory system for web and POS.

# Installation Steps
1. Clone the project from this repository to any of your directory.
2. Run the following commands:

```bash
 copy .env.example .env
 composer install
 php artisan key:generate
 php artisan make:schema
 php artisan migrate
 php artisan db:seed
 php artisan optimize
```

# For Testing
Run the following commands:
```bash
composer install
yarn install
php artisan serve
yarn run dev
```
