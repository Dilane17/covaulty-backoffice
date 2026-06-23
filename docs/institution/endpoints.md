# Endpoints du Module Institution (Tenant)

---

### `POST /institutions` (Super Admin uniquement)
Création d'une nouvelle institution (Onboarding d'un nouveau client B2B).
- **Payload** :
  ```json
  {
    "name": "Microfinance Alpha",
    "subdomain": "alpha" // Optionnel, généré automatiquement si vide
  }
  ```
- **Retour Succès** :
  ```json
  {
    "id": "inst_789",
    "name": "Microfinance Alpha",
    "subdomain": "alpha"
  }
  ```
- **Erreurs Possibles** :
  - `TENANT_002` : Ce nom ou sous-domaine est déjà utilisé (Conflit).

---

### `POST /institutions/invite` (Super Admin uniquement)
Crée une institution, ajoute automatiquement un utilisateur `ADMIN` et lui envoie un e-mail avec un lien sécurisé pour définir son mot de passe.
- **Payload** :
  ```json
  {
    "name": "Microfinance Beta",
    "contactEmail": "admin@beta.com"
  }
  ```
- **Retour Succès** :
  ```json
  {
    "message": "Institution created and invitation sent successfully.",
    "institution": { ... }
  }
  ```

---

### `GET /institutions`
Récupère la liste de toutes les institutions (Super Admin) ou les infos de sa propre institution (Admin).

---

### `GET /institutions/:idOrSlug`
Résout l'institution à partir de son ID ou de son sous-domaine (Utilisé par le front-end lors du chargement de la page de login).
- **Erreurs Possibles** : `TENANT_001` (Institution introuvable).
