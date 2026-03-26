export const generateSprintReportHTML = (sprint, tasks, history) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const progressPercent =
    totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(2) : 0;

  return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Rapport Sprint ${sprint.number || sprint._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 3px solid #4caf50; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            .progress-container { background: #eee; height: 30px; border-radius: 15px; overflow: hidden; margin: 20px 0; }
            .progress-bar { background: #4caf50; height: 100%; line-height: 30px; color: white; text-align: center; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #4caf50; color: white; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
            tr:hover { background: #f5f5f5; }
            .status { padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
            .status-todo { background: #e3f2fd; color: #1976d2; }
            .status-inprogress { background: #fff3e0; color: #f57c00; }
            .status-standby { background: #ffebee; color: #c62828; }
            .status-done { background: #e8f5e9; color: #2e7d32; }
            .priority { padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
            .priority-basse { background: #e0e0e0; color: #616161; }
            .priority-moyenne { background: #fff3e0; color: #f57c00; }
            .priority-haute { background: #ffebee; color: #c62828; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📊 Rapport Sprint ${sprint.number || "N/A"}</h1>
            <p><strong>Nom :</strong> ${sprint.title || "Sprint"}</p>
            <p><strong>Période :</strong> ${
              sprint.start_date
                ? new Date(sprint.start_date).toLocaleDateString("fr-FR")
                : "N/A"
            } → ${
    sprint.end_date
      ? new Date(sprint.end_date).toLocaleDateString("fr-FR")
      : "N/A"
  }</p>

            <h2>📈 Avancement du Sprint</h2>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${progressPercent}%">${progressPercent}%</div>
            </div>
            <p><strong>Tâches terminées :</strong> ${doneTasks} / ${totalTasks}</p>

            <h2>✅ Tâches du Sprint</h2>
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                </tr>
              </thead>
              <tbody>
                ${
                  tasks.length > 0
                    ? tasks
                        .map(
                          (t) => `
                  <tr>
                    <td><strong>${t.title}</strong></td>
                    <td>${t.description}</td>
                    <td><span class="status status-${t.status.toLowerCase()}">${
                            t.status
                          }</span></td>
                    <td><span class="priority priority-${t.priority.toLowerCase()}">${
                            t.priority
                          }</span></td>
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="4">Aucune tâche</td></tr>'
                }
              </tbody>
            </table>

            <h2>📜 Historique des Changements</h2>
            <table>
              <thead>
                <tr>
                  <th>Tâche</th>
                  <th>Ancien Statut</th>
                  <th>Nouveau Statut</th>
                  <th>Date</th>
                  <th>Modifié par</th>
                </tr>
              </thead>
              <tbody>
                ${
                  history.length > 0
                    ? history
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
                  </tr>
                `
                        )
                        .join("")
                    : '<tr><td colspan="5">Aucun historique</td></tr>'
                }
              </tbody>
            </table>

            <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888;">
              <p>Rapport généré le ${new Date().toLocaleString("fr-FR")}</p>
            </footer>
          </div>
        </body>
      </html>
    `;
};
