# TP Docker - MySQL 9.6

Environnement MySQL conteneurisé pour le TP Ynov CI.

## Prérequis

- Docker installé
- WSL activé (Windows) ou environnement Linux/macOS

## Configuration

1. **Créer le fichier `.env`** (mot de passe MySQL) :
   ```bash
   cp .env.example .env
   ```
   Modifier `.env` si besoin pour changer le mot de passe.

2. **Construire l'image** :
   ```bash
   docker build -t migration_mysql .
   ```

3. **Lancer le conteneur** :
   ```bash
   docker run -d --env-file .env --name migration_container migration_mysql
   ```

## Vérification

Entrer dans le conteneur et vérifier la base de données :

```bash
docker exec -it migration_container /bin/bash
mysql -p
# Entrer le mot de passe (ynovpwd par défaut)
show databases;
# Doit afficher : ynov_ci
use ynov_ci;
show tables;
# Doit afficher : utilisateur
```

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `docker container stop migration_container` | Arrêter le conteneur |
| `docker container rm migration_container` | Supprimer le conteneur |
| `docker image rm migration_mysql` | Supprimer l'image |

## Structure

- `sqlfiles/migration-v001.sql` : Création de la base `ynov_ci`
- `sqlfiles/migration-v002.sql` : Création de la table `utilisateur`
- Les scripts SQL s'exécutent dans l'ordre alphabétique au premier démarrage
