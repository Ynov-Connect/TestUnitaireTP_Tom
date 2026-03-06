# Image MySQL pour l'environnement Ynov CI
FROM mysql:9.6

# Le mot de passe est passé via --env-file au moment du run
COPY ./sqlfiles/ /docker-entrypoint-initdb.d/

EXPOSE 3306
