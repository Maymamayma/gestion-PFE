# Project Team & Work Distribution

## **Groupe A — Abir Abidi & Oumayma Zayet**

### **Work Distribution**

Pour l’équipe A, nous avons réparti les tâches comme suit :

- **Abir Abidi** : Développement des endpoints liés au **Project** (CRUD, intégration, corrections).
- **Oumayma Zayet** : Développement des endpoints du **Sprint** (création du modèle, CRUD complet, corrections et intégration).

Ce travail inclut notamment (exemples des commits) :

- `feat: complete CRUD for Project endpoints`
- `feat: complete CRUD for Sprint endpoints`
- Intégration et résolutions de conflits lors des merges (ex: merges depuis `develop` vers `feature/sprint`)
- Ajustements, corrections et harmonisation du code (`fixing some issues`, corrections d’import/export, etc.)

---

## **Groupe B — Eya Moalla & Salma Feryel Jamli**

### **Work Distribution**

L’équipe a travaillé ensemble sur toutes les fonctionnalités.

- **User Story**
  Le module suit une architecture propre et modulaire :
  Routes → Validateurs (Zod) → Contrôleur → Service → Modèle (Mongoose)

Le modèle UserStory contient :

-title, description
-start_date, end_date
-projectId (référence au Projet)
-sprintId (référence au Sprint)

-> Chaque User Story appartient à un projet et un sprint.

Routes UserStory:

| Méthode | Route                                                             | Description                                |
| ------- | ----------------------------------------------------------------- | ------------------------------------------ |
| POST    | `/projects/:projectId/sprints/:sprintId/userStories`              | Créer une nouvelle User Story              |
| GET     | `/projects/:projectId/sprints/:sprintId/userStories`              | Lister toutes les User Stories d’un sprint |
| GET     | `/projects/:projectId/sprints/:sprintId/userStories/:userStoryId` | Récupérer une User Story spécifique        |
| PUT     | `/projects/:projectId/sprints/:sprintId/userStories/:userStoryId` | Mettre à jour une User Story               |
| DELETE  | `/projects/:projectId/sprints/:sprintId/userStories/:userStoryId` | Supprimer une User Story                   |

- **Reports**
  Ce module permet aux étudiants de téléverser des rapports PDF, de gérer les différentes versions, et de consulter ou télécharger l’historique complet des rapports associés à un projet.

Routes → Middleware (upload PDF) → Contrôleurs → Services → Modèle (Mongoose)

Le modèle Report contient :

-projectId : référence au Projet
-date : date du dépôt
-fileName, filePath : informations du fichier PDF
-version : numéro de version auto-incrémenté
-notes : remarques optionnelles
-createdAt : date automatique de création

Un middleware Multer gère l’upload sécurisé des fichiers :

-Stockage dans uploads/reports
-Renommage unique du fichier
-Filtrage strict : uniquement PDF

Routes Rapports:
| Méthode | Route | Description |
| ------- | ------------------------------------------------- | ----------------------------------------------------------- |
| POST | `/projects/:projectId/reports/upload` | Téléverser un rapport PDF (création d’une nouvelle version) |
| GET | `/projects/:projectId/reports` | Lister l’historique complet des rapports d’un projet |
| GET | `/projects/:projectId/reports/:reportId/download` | Télécharger un rapport PDF spécifique |

---

## **Groupe C — Malek Fitouri & Ala Eddine Guidara**

### **Work Distribution**

L’équipe a travaillé conjointement sur la majorité des fonctionnalités (endpoints, modèles, intégration générale).
Pour une meilleure répartition, voici les responsabilités principales :

- **Ala Eddine Guidara**

Mise en place des validations avec Zod.

Participation au développement des endpoints (Task, User Story, Report, History).

Corrections backend & organisation du code.

- **Malek Fitouri**

Documentation API avec Swagger.

Contribution au développement des endpoints (Task, Sprint report, Project report).

Structuration et nettoyage des routes + fixes d’intégration.

Travail collaboratif (les deux)

Tests des endpoints.

Vérification de la cohérence des modules (tasks, reports, sprint history).

Débogage & ajustements finaux avant merge.

- 'Note : Les commits apparaissent depuis une seule machine, mais le travail a été réalisé en binôme de manière coordonnée.'

---

##  **Groupe D — Khairi Hammami & Aymen Settey**

### **Work Distribution**

L'équipe D a implémenté le module **Validations & Réunions** du système de gestion de PFE.

#### **Répartition des tâches**

* **Aymen Settey** : 
  - Développement du système de réunions (Meeting model, service, controller)
  - Intégration des références de réunions dans les validations
  - Développement des endpoints de validation liés aux réunions
  - Documentation Swagger pour les endpoints de réunions

* **Khairi Hammami** :
  - Réparation et Amélioration du système de réunions et validation
  - Implémentation des endpoints CRUD pour les réunions
  - Système de validation du contenu des réunions par l'encadrant universitaire et professionnel
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

#### **Endpoints Réunions (Meetings)**

| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| POST | `/api/meetings` | Créer une réunion avec ordre du jour | Étudiant |
| GET | `/api/meetings` | Lister toutes les réunions (avec filtre projet optionnel) | Tous |
| GET | `/api/meetings/upcoming` | Récupérer les réunions à venir (statut Planifiee) | Tous |
| GET | `/api/meetings/completed` | Récupérer les réunions effectuées (statut Effectuee) | Tous |
| GET | `/api/meetings/cancelled` | Récupérer les réunions annulées (statut Annulee) | Tous |
| GET | `/api/meetings/:id` | Récupérer les détails d'une réunion spécifique | Tous |
| PUT | `/api/meetings/:id` | Modifier une réunion non effectuée | Étudiant |
| POST | `/api/meetings/:id/complete` | Compléter une réunion avec compte rendu | Étudiant |
| POST | `/api/meetings/:id/cancel` | Annuler une réunion planifiée | Étudiant |
| POST | `/api/meetings/:id/validate` | Valider le contenu d'une réunion effectuée | Encadrant universitaire |
| DELETE | `/api/meetings/:id` | Supprimer une réunion | Étudiant |

#### **Endpoints Validations**

| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| POST | `/api/validations/tasks/:taskId/validate` | Valider une tâche (avec réunion optionnelle) | Encadrants |
| GET | `/api/validations/tasks/:taskId/validations` | Récupérer toutes les validations d'une tâche | Tous |
| GET | `/api/validations/meetings/:meetingId/validations` | Récupérer les validations liées à une réunion | Tous |

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

# Commit History Overview & Contribution Context

Voici une synthèse structurée des contributions observées dans l’historique GitHub.
Elle sert à visualiser l’évolution du projet et facilite la répartition finale du travail par équipe.

## **Back-end Foundations & Core Setup**

- Initialisation du projet : `Initial commit`
- Configuration environnement : `add env example file`, fixes d’import/export, corrections serveur (`fix server.js`, `fix de app.js`, `fix export default in db.js`)
- Mise en place de l’authentification :

  - Ajout du modèle User
  - Middleware d’authentification
  - Routes & contrôleur (multiples commits liés)

## **Project & Sprint Modules**

- Création du modèle Sprint : `creation model sprint`
- CRUD complet Project : `feat: complete CRUD for Project endpoints`
- CRUD complet Sprint : `feat: complete CRUD for Sprint endpoints`
- Merges réguliers avec `develop` et `main`

## **Dashboard & Aggregation**

- Endpoint tableau de bord : `feat(dashboard): implement aggregated dashboard endpoint`

## **Reports & History Management**

Nombreuses features liées aux rapports :

- Génération HTML (Sprint + Project)
- Upload de versions de rapport
- Historique de rapport
- Correctifs de routes pour ces modules

## **Task Module**

- Création / Update / Delete Task
- Changement de statut avec historique automatique
- Validations avancées via **Zod**
- Plusieurs merges pour synchroniser `task`, `userstory`, `validation`…

## **User Stories**

- CRUD complet
- Priorisation avec merges multiples
- Fixes de routage

## **Refactoring Global**

- Passage massif à `import/export`
- Corrections générales (nom de fichiers, middlewares, structure des routes…)

---

# Allocation du Travail par Deadline (Résumé)

Plusieurs blocs du projet ont été complétés dans une période rapprochée, en particulier :

- CRUD Sprint & Project
- Authentification & modèles
- Validation Zod
- Reports (HTML + historique + versioning)
- Dashboard
- Corrections globales (import/export, structure app, erreurs)
