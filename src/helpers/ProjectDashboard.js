// A helper to format and structure the dashboard response consistently

export const formatDashboard = ({
  project,
  sprints,
  stats,
  lastMeetings,
  lastReports,
  journal,
}) => {
  return {
    project: {
      id: project._id,
      title: project.title,
      description: project.description,
      semester: project.semester,
      students: project.students,
      supervisors: {
        company: project.company_supervisor_id,
        university: project.university_supervisor_id,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    },

    sprints: sprints.map((s) => ({
      id: s._id,
      title: s.title,
      goal: s.goal,
      status: s.status,
      startDate: s.start_date,
      endDate: s.end_date,
    })),

    stats: {
      totalTasks: stats.totalTasks,
      statusCount: stats.countByStatus,
      percentDone: stats.percentDone,
      pendingValidations: stats.pendingValidations,
    },

    lastMeetings: lastMeetings.map((m) => ({
      id: m._id,
      type: m.type,
      date: m.date,
      attendees: m.attendees,
      notes: m.notes,
    })),

    lastReports: lastReports.map((r) => ({
      id: r._id,
      version: r.version,
      uploadedAt: r.uploaded_at,
      file: r.file_url,
    })),

    journal: journal.map((entry) => ({
      type: entry.type,
      date: entry.date,
      data: entry.data,
    })),
  };
};
