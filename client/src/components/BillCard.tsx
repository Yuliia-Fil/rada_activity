export default function BillCard({ bill }) {
  const getColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f87171"; // червоний
      case "medium":
        return "#fbbf24"; // жовто-оранжевий
      case "low":
        return "#34d399"; // зелений
      default:
        return "#ccc";
    }
  };

  return (
    <div
      style={{
        border: `2px solid ${getColor(bill.priority)}`,
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>
        <a href={bill.link} target="_blank" rel="noreferrer">
          {bill.number}
        </a>
      </h3>
      <p>{bill.title}</p>
      <p>{bill.date}</p>
      <p>
        <strong style={{ color: getColor(bill.priority) }}>
          {bill.priority.toUpperCase()}
        </strong>
      </p>
    </div>
  );
}
