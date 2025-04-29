import React from "react";

// Nhận 1 object (data), render từng cặp key-value
export default function KeyValueTable({ data }) {
  if (!data || typeof data !== "object") return null;

  return (
    <table style={{ width: "100%", background: "#f7f7f7", borderRadius: 6, padding: 12 }}>
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr key={key}>
            <td style={{ fontWeight: "bold", padding: "6px 12px", width: "40%", color: "#1a4d7c" }}>{key}</td>
            <td style={{ padding: "6px 12px" }}>
              {typeof value === "object" && value !== null
                ? <pre style={{ margin: 0, background: "none", padding: 0 }}>{JSON.stringify(value, null, 2)}</pre>
                : String(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
