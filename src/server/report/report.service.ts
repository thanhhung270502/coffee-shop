import {
  getExportOrdersData,
  getRevenueSeries,
  getTopProductsWithRevenue,
} from "./report.repository";
import type { ExportOrdersQueryInput, RevenueQueryInput, TopProductsQueryInput } from "./report.schema";
import type { RevenuePoint, TopProductItem } from "./report.types";

export async function getRevenueSeriesService(
  input: RevenueQueryInput,
): Promise<{ series: RevenuePoint[] }> {
  const series = await getRevenueSeries(input.from, input.to, input.groupBy);
  return { series };
}

export async function getTopProductsReportService(
  input: TopProductsQueryInput,
): Promise<{ products: TopProductItem[] }> {
  const products = await getTopProductsWithRevenue(input.from, input.to, input.limit);
  return { products };
}

export async function exportOrdersCsvService(input: ExportOrdersQueryInput): Promise<string> {
  const orders = await getExportOrdersData(input.from, input.to);

  const headers = [
    "Order #",
    "Date",
    "Type",
    "Channel",
    "Status",
    "Customer",
    "Phone",
    "Payment Method",
    "Payment Status",
    "Items",
    "Subtotal",
    "Shipping Fee",
    "Total",
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${item.product.name} x${item.quantity}`)
      .join("; ");

    return [
      order.orderNumber,
      new Date(order.createdAt).toISOString(),
      order.type,
      order.channel,
      order.status,
      order.customerName ?? "",
      order.customerPhone ?? "",
      order.paymentMethod ?? "",
      order.paymentStatus,
      itemsSummary,
      order.subtotal,
      order.shippingFee,
      order.total,
    ]
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
