# Endpoints du Module Agence (Agency)

---

### `POST /agencies` (SuperAdmin / Admin)
Crée une nouvelle agence pour l'institution.
- **Payload** :
  ```json
  {
    "name": "Agence de Cotonou",
    "address": "Quartier Haie Vive, Rue 12",
    "phone": "+22900000000",
    "email": "cotonou@covaulty.com"
  }
  ```
- **Retour Succès** : Objet `Agency` avec statut HTTP 201.

---

### `GET /agencies`
Liste les agences de l'institution.
- **Retour Succès** : Tableau d'objets `Agency`.

---

### `GET /agencies/:id`
Récupère les détails d'une agence spécifique (incluant son `walletBalance`).
- **Retour Succès** : Objet `Agency`.
- **Erreurs Possibles** : `AGENCY_001` (Agence introuvable).

---

### `PATCH /agencies/:id` (SuperAdmin / Admin)
Modifie les informations d'une agence.
- **Payload** : (Mêmes champs que POST, tous optionnels).

---

### `DELETE /agencies/:id` (SuperAdmin / Admin)
Désactive une agence (Soft delete).
