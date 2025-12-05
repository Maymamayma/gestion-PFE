#  Project Team & Work Distribution

##  **Groupe A — Abir Abidi & Oumayma Zayet**

### **Work Distribution**

Pour l’équipe A, nous avons réparti les tâches comme suit :

* **Abir Abidi** : Développement des endpoints liés au **Project** (CRUD, intégration, corrections).
* **Oumayma Zayet** : Développement des endpoints du **Sprint** (création du modèle, CRUD complet, corrections et intégration).

Ce travail inclut notamment (exemples des commits) :

* `feat: complete CRUD for Project endpoints`
* `feat: complete CRUD for Sprint endpoints`
* Intégration et résolutions de conflits lors des merges (ex: merges depuis `develop` vers `feature/sprint`)
* Ajustements, corrections et harmonisation du code (`fixing some issues`, corrections d’import/export, etc.)

---

##  **Groupe B — Eya Moalla & Salma Feryel Jamli**

### **Work Distribution**


* …
* …

---

##  **Groupe C — Malek Fitouri & Ala Eddine Guidara**

### **Work Distribution**


L’équipe a travaillé conjointement sur la majorité des fonctionnalités (endpoints, modèles, intégration générale).
Pour une meilleure répartition, voici les responsabilités principales :

* **Ala Eddine Guidara**

Mise en place des validations avec Zod.

Participation au développement des endpoints (Task, User Story, Report, History).

Corrections backend & organisation du code.

* **Malek Fitouri**

Documentation API avec Swagger.

Contribution au développement des endpoints (Task, Sprint report, Project report).

Structuration et nettoyage des routes + fixes d’intégration.

Travail collaboratif (les deux)

Tests des endpoints.

Vérification de la cohérence des modules (tasks, reports, sprint history).

Débogage & ajustements finaux avant merge.

* 'Note : Les commits apparaissent depuis une seule machine, mais le travail a été réalisé en binôme de manière coordonnée.'
---

##  **Groupe D — Khairi Hammami & Aymen Settey**

### **Work Distribution**

L'équipe D a implémenté le module **Validations & Réunions** du système de gestion de PFE.

#### **Répartition des tâches**

* **Aymen Settey** : 
  - Développement du système de réunions (Meeting model, service, controller)
  - Implémentation des endpoints CRUD pour les réunions
  - Système de validation du contenu des réunions par l'encadrant universitaire
  - Documentation Swagger pour les endpoints de réunions

* **Khairi Hammami** :
  - Amélioration du système de validation existant
  - Intégration des références de réunions dans les validations
  - Développement des endpoints de validation liés aux réunions
  - Création de la collection Postman pour les tests

#### **Fonctionnalités implémentées**

**1. Gestion des Réunions (Meetings)**
- Création de réunions avec ordre du jour (agenda)
- Mise à jour des réunions non complétées
- Complétion des réunions avec compte rendu réel (actualReport)
- Validation du contenu des réunions par l'encadrant universitaire
- Système de références : une réunion peut référencer une User Story, Task, ou Report
- Filtrage des réunions (à venir, complétées, par projet)
- Suppression de réunions

**2. Système de Validation Amélioré**
- Validation de tâches avec référence optionnelle à une réunion
- Support "hors réunion" (meetingId = null)
- Récupération des validations par tâche
- Récupération des validations par réunion
- Horodatage et traçabilité complète

**3. Endpoints API développés**

*Réunions:*
- `POST /api/meetings` - Créer une réunion (Étudiant)
- `GET /api/meetings` - Lister toutes les réunions
- `GET /api/meetings/upcoming` - Réunions à venir
- `GET /api/meetings/completed` - Réunions complétées
- `GET /api/meetings/:id` - Détails d'une réunion
- `PUT /api/meetings/:id` - Modifier une réunion (Étudiant)
- `POST /api/meetings/:id/complete` - Compléter une réunion (Étudiant)
- `POST /api/meetings/:id/validate` - Valider le contenu (Encadrant universitaire)
- `DELETE /api/meetings/:id` - Supprimer une réunion (Étudiant)

*Validations:*
- `POST /api/validations/tasks/:taskId/validate` - Valider une tâche (Encadrants)
- `GET /api/validations/tasks/:taskId/validations` - Validations d'une tâche
- `GET /api/validations/meetings/:meetingId/validations` - Validations d'une réunion

**4. Modèles de données**

*Meeting Model:*
- projectId, plannedDate, agenda, actualReport
- isCompleted, referenceType, referenceId
- isValidated, validatedBy, validatedAt, validationComment
- createdBy, timestamps

*Validation Model (amélioré):*
- taskId, isValid, comment, validatedBy, validatedAt
- meetingId (optionnel), typeValidation

**5. Contrôle d'accès (RBAC)**
- Étudiant : création, modification, complétion, suppression de réunions
- Encadrant entreprise : validation de tâches
- Encadrant universitaire : validation de tâches + validation du contenu des réunions

**6. Documentation et Tests**
- Documentation Swagger complète pour tous les endpoints
- Collection Postman avec scénarios de test complets
- Validation Zod pour toutes les entrées
- Gestion d'erreurs robuste

---

#  Commit History Overview & Contribution Context

Voici une synthèse structurée des contributions observées dans l’historique GitHub.
Elle sert à visualiser l’évolution du projet et facilite la répartition finale du travail par équipe.

##  **Back-end Foundations & Core Setup**

* Initialisation du projet : `Initial commit`
* Configuration environnement : `add env example file`, fixes d’import/export, corrections serveur (`fix server.js`, `fix de app.js`, `fix export default in db.js`)
* Mise en place de l’authentification :

  * Ajout du modèle User
  * Middleware d’authentification
  * Routes & contrôleur (multiples commits liés)

##  **Project & Sprint Modules**

* Création du modèle Sprint : `creation model sprint`
* CRUD complet Project : `feat: complete CRUD for Project endpoints`
* CRUD complet Sprint : `feat: complete CRUD for Sprint endpoints`
* Merges réguliers avec `develop` et `main`

##  **Dashboard & Aggregation**

* Endpoint tableau de bord : `feat(dashboard): implement aggregated dashboard endpoint`

##  **Reports & History Management**

Nombreuses features liées aux rapports :

* Génération HTML (Sprint + Project)
* Upload de versions de rapport
* Historique de rapport
* Correctifs de routes pour ces modules

##  **Task Module**

* Création / Update / Delete Task
* Changement de statut avec historique automatique
* Validations avancées via **Zod**
* Plusieurs merges pour synchroniser `task`, `userstory`, `validation`…

##  **User Stories**

* CRUD complet
* Priorisation avec merges multiples
* Fixes de routage

##  **Refactoring Global**

* Passage massif à `import/export`
* Corrections générales (nom de fichiers, middlewares, structure des routes…)

---

#  Allocation du Travail par Deadline (Résumé)

Plusieurs blocs du projet ont été complétés dans une période rapprochée, en particulier :

* CRUD Sprint & Project
* Authentification & modèles
* Validation Zod
* Reports (HTML + historique + versioning)
* Dashboard
* Corrections globales (import/export, structure app, erreurs)


