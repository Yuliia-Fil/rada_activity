export const getColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "#dc2626";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#16a34a";
    default:
      return "#6b7280";
  }
};
