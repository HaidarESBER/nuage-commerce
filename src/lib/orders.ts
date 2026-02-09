"use server";

import { promises as fs } from "fs";
import path from "path";
import { Order, CreateOrderData, generateOrderNumber, generateOrderId } from "@/types/order";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "orders.json");

/**
 * Read orders from JSON file
 */
async function readOrdersFile(): Promise<Order[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as Order[];
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("Error reading orders file:", error);
    return [];
  }
}

/**
 * Write orders to JSON file
 */
async function writeOrdersFile(orders: Order[]): Promise<void> {
  // Ensure data directory exists
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

/**
 * Create a new order
 * @param data - Order data from checkout form
 * @returns Created order with generated ID and order number
 */
export async function createOrder(data: CreateOrderData): Promise<Order> {
  const orders = await readOrdersFile();

  // Generate unique order number
  const existingNumbers = orders.map((o) => o.orderNumber);
  const orderNumber = generateOrderNumber(existingNumbers);

  const now = new Date().toISOString();

  const newOrder: Order = {
    id: generateOrderId(),
    orderNumber,
    items: data.items,
    subtotal: data.subtotal,
    shipping: data.shipping,
    total: data.total,
    status: "pending",
    shippingAddress: data.shippingAddress,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };

  orders.push(newOrder);
  await writeOrdersFile(orders);

  return newOrder;
}

/**
 * Get an order by its order number
 * @param orderNumber - Human-readable order number (e.g., NU-2026-0001)
 * @returns Order if found, null otherwise
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const orders = await readOrdersFile();
  return orders.find((o) => o.orderNumber === orderNumber) ?? null;
}

/**
 * Get an order by its ID
 * @param id - Order UUID
 * @returns Order if found, null otherwise
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await readOrdersFile();
  return orders.find((o) => o.id === id) ?? null;
}

/**
 * Get all orders
 * @returns Array of all orders, sorted by creation date (newest first)
 */
export async function getAllOrders(): Promise<Order[]> {
  const orders = await readOrdersFile();
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Update order status
 * @param id - Order ID
 * @param status - New status
 * @returns Updated order
 */
export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order> {
  const orders = await readOrdersFile();
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    throw new Error(`Order with id ${id} not found`);
  }

  const now = new Date().toISOString();
  const updates: Partial<Order> = {
    status,
    updatedAt: now,
  };

  // Set timestamp when shipped
  if (status === "shipped" && orders[index].status !== "shipped") {
    updates.shippedAt = now;
  }

  // Set timestamp when delivered
  if (status === "delivered" && orders[index].status !== "delivered") {
    updates.deliveredAt = now;
  }

  orders[index] = {
    ...orders[index],
    ...updates,
  };

  await writeOrdersFile(orders);

  // Send shipping notification email if status changed to shipped
  if (status === "shipped" && orders[index].trackingNumber) {
    // Trigger email in background (don't await)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-shipping-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orders[index] }),
    }).catch((error) => {
      console.error("Failed to send shipping notification:", error);
    });
  }

  return orders[index];
}

/**
 * Update order tracking information
 * @param id - Order ID
 * @param trackingInfo - Tracking number, URL, and estimated delivery
 * @returns Updated order
 */
export async function updateOrderTracking(
  id: string,
  trackingInfo: {
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  }
): Promise<Order> {
  const orders = await readOrdersFile();
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    throw new Error(`Order with id ${id} not found`);
  }

  orders[index] = {
    ...orders[index],
    ...trackingInfo,
    updatedAt: new Date().toISOString(),
  };

  await writeOrdersFile(orders);
  return orders[index];
}

/**
 * Order statistics for admin dashboard
 */
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
}

/**
 * Get order statistics
 * @returns Order counts by status
 */
export async function getOrderStats(): Promise<OrderStats> {
  const orders = await readOrdersFile();

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };
}
