import { getStockStatus } from "../utils/stock";

export default function StockBadge({ quantity }) {
  const { label, statusClass } = getStockStatus(quantity);
  return <span className={`status ${statusClass}`}>{label}</span>;
}
