import { order, products } from "../data/demo";

/** Order maths — everything derived from src/data/demo.ts. */
export const orderLines = order.lines.map((line) => {
  const product = products[line.productId];
  return {
    ...line,
    product,
    lineTotalMinor: product.priceMinor * line.qty,
  };
});

export const orderSubtotalMinor = orderLines.reduce(
  (sum, l) => sum + l.lineTotalMinor,
  0,
);
export const orderTotalMinor = orderSubtotalMinor + order.deliveryFeeMinor;

export const stockFor = (productId: keyof typeof products, size: string) =>
  (products[productId].stock as Record<string, number>)[size] ?? 0;
