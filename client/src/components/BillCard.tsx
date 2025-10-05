import type { Bill } from "../types/Bill";
import type { Priority } from "../types/priority";

export default function BillCard({ bill }: { bill: Bill }) {
  const getColor = (priority: Priority) => {
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

  const borderColor = getColor(bill.priority);

  return (
    <div
      style={{
        borderLeft: `6px solid ${borderColor}`,
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
          <a
            href={bill.link}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", color: "#2563eb" }}
          >
            {bill.number}
          </a>
        </h3>
        <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {bill.date}
        </span>
      </div>

      <p
        style={{
          margin: "4px 0 12px 0",
          fontSize: "0.95rem",
          color: "#374151",
        }}
      >
        {bill.title}
      </p>

      <p style={{ margin: 0, textAlign: "right" }}>
        <span
          style={{
            color: "#fff",
            backgroundColor: borderColor,
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {bill.priority.toUpperCase()}
        </span>
      </p>
    </div>
  );
}
