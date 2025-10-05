interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function DateFilter({ filter, setFilter }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: "200px",
      }}
    >
      <label style={{ fontWeight: 600, color: "#374151" }}>Дата:</label>
      <input
        type="date"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "0.95rem",
          backgroundColor: "#f9fafb",
          cursor: "pointer",
          flex: 1,
        }}
      />
    </div>
  );
}
