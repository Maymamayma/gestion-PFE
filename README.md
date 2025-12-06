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

## **Groupe D — Khair Hammai & Aymen Settey**

### **Work Distribution**

- …
- …

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
