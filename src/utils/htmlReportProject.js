export const generateProjectReportHTML = (
  project,
  sprints,
  allTasks,
  allHistory
) => {
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = allTasks.filter(
    (t) => t.status === "InProgress"
  ).length;
  const standbyTasks = allTasks.filter((t) => t.status === "Standby").length;
  const todoTasks = allTasks.filter((t) => t.status === "ToDo").length;
  const progressPercent =
    totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(2) : 0;

  // Grouper les tâches par sprint
  const tasksBySprint = {};
  allTasks.forEach((task) => {
    const sprintId = task.sprintId?.toString() || "no-sprint";
    if (!tasksBySprint[sprintId]) {
      tasksBySprint[sprintId] = [];
    }
    tasksBySprint[sprintId].push(task);
  });

  return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Rapport Global Projet ${project.title || "PFE"}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1400px; margin: 0 auto; background: white; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 3px solid #2196f3; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            h3 { color: #666; margin-top: 20px; }
            .stats { display: flex; justify-content: space-around; margin: 30px 0; }
            .stat-card { background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px; text-align: center; min-width: 150px; }
            .stat-card h3 { margin: 0 0 10px 0; font-size: 16px; color: #666; }
            .stat-card .number { font-size: 36px; font-weight: bold; color: #2196f3; }
            .stat-card.done .number { color: #4caf50; }
            .stat-card.standby .number { color: #f44336; }
            .progress-container { background: #eee; height: 40px; border-radius: 20px; overflow: hidden; margin: 20px 0; position: relative; }
            .progress-bar { background: linear-gradient(90deg, #4caf50, #8bc34a); height: 100%; line-height: 40px; color: white; text-align: center; font-weight: bold; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #2196f3; color: white; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
            tr:hover { background: #f5f5f5; }
            .status { padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; display: inline-block; }
            .status-todo { background: #e3f2fd; color: #1976d2; }
            .status-inprogress { background: #fff3e0; color: #f57c00; }
            .status-standby { background: #ffebee; color: #c62828; }
            .status-done { background: #e8f5e9; color: #2e7d32; }
            .priority { padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; display: inline-block; }
            .priority-basse { background: #e0e0e0; color: #616161; }
            .priority-moyenne { background: #fff3e0; color: #f57c00; }
            .priority-haute { background: #ffebee; color: #c62828; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .sprint-section { background: #fafafa; padding: 20px; margin: 20px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📊 Rapport Global du Projet</h1>
            <h2>${project.title || "Projet PFE"}</h2>
            <p>${project.description || ""}</p>

            <h2>📈 Vue d'ensemble</h2>
            <div class="stats">
              <div class="stat-card">
                <h3>Total Tâches</h3>
                <div class="number">${totalTasks}</div>
              </div>
              <div class="stat-card done">
                <h3>✅ Terminées</h3>
                <div class="number">${doneTasks}</div>
              </div>
              <div class="stat-card">
                <h3>🔄 En cours</h3>
                <div class="number">${inProgressTasks}</div>
              </div>
              <div class="stat-card standby">
                <h3>⏸️ Bloquées</h3>
                <div class="number">${standbyTasks}</div>
              </div>
              <div class="stat-card">
                <h3>📋 À faire</h3>
                <div class="number">${todoTasks}</div>
              </div>
            </div>

            <h3>Progression Globale</h3>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${progressPercent}%">${progressPercent}%</div>
            </div>

            ${
              standbyTasks > 0
                ? `
            <div class="alert">
              <strong>⚠️ Attention :</strong> ${standbyTasks} tâche(s) bloquée(s) nécessite(nt) votre attention !
            </div>
            `
                : ""
            }

            <h2>📋 Toutes les Tâches du Projet</h2>
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                  <th>Sprint</th>
                </tr>
              </thead>
              <tbody>
                ${
                  allTasks.length > 0
                    ? allTasks
                        .map(
                          (t) => `
                  <tr>
                    <td><strong>${t.title}</strong></td>
                    <td>${t.description.substring(0, 80)}${
                            t.description.length > 80 ? "..." : ""
                          }</td>
                    <td><span class="status status-${t.status.toLowerCase()}">${
                            t.status
                          }</span></td>
                    <td><span class="priority priority-${t.priority.toLowerCase()}">${
                            t.priority
                          }</span></td>
                    <td>${t.sprintId?.nom || t.sprintId || "N/A"}</td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="5">Aucune tâche</td></tr>'
                }
              </tbody>
            </table>

            <h2>📜 Historique Global des Changements</h2>
            <table>
              <thead>
                <tr>
                  <th>Tâche</th>
                  <th>Ancien Statut</th>
                  <th>Nouveau Statut</th>
                  <th>Date</th>
                  <th>Modifié par</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${
                  allHistory.length > 0
                    ? allHistory
                        .slice(0, 50)
                        .map(
                          (h) => `
                  <tr>
                    <td>${h.taskId?.title || "N/A"}</td>
                    <td><span class="status status-${h.oldStatus.toLowerCase()}">${
                            h.oldStatus
                          }</span></td>
                    <td><span class="status status-${h.newStatus.toLowerCase()}">${
                            h.newStatus
                          }</span></td>
                    <td>${new Date(h.changedAt).toLocaleString("fr-FR")}</td>
                    <td>${
                      h.changedBy?.user_name || h.changedBy?.email || "Inconnu"
                    }</td>
                    <td>${h.notes || "-"}</td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="6">Aucun historique</td></tr>'
                }
              </tbody>
            </table>
            ${
              allHistory.length > 50
                ? `<p style="text-align: center; color: #666; margin-top: 10px;">Affichage des 50 derniers changements (${allHistory.length} au total)</p>`
                : ""
            }

            <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888;">
              <p>Rapport global généré le ${new Date().toLocaleString(
                "fr-FR"
              )}</p>
            </footer>
          </div>
        </body>
      </html>
    `;
};
