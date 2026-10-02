// Stock rules used across the dashboards and management pages.
export const LOW_STOCK_LIMIT = 2; // "fewer than 2 copies" is low stock

export function getStockStatus(quantity) {
  const qty = Number(quantity) || 0;

  if (qty === 0) {
    return { label: "OUT OF STOCK", statusClass: "out-stock", rowClass: "out-row" };
  }
  if (qty < LOW_STOCK_LIMIT) {
    return { label: "LOW STOCK", statusClass: "low-stock", rowClass: "low-row" };
  }
  return { label: "AVAILABLE", statusClass: "available", rowClass: "" };
}
