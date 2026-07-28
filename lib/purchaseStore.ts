/**
 * Client-side storage bridge between the studio page and the post-payment
 * success page. Clean (watermark-free) renders can be several MB as data URLs,
 * which exceeds sessionStorage quota — IndexedDB is used instead.
 *
 * Shares DB with photoSessionStore (version 3).
 */

const DB_NAME = "ai-studio-id";
const DB_VERSION = 3;
const STORE = "pending-purchase";
const PENDING_KEY = "pending";

export interface PurchaseSummary {
  styleLabel: string;
  backgroundLabel: string;
  dimensionLabel: string;
}

export interface PendingPurchase {
  singleDataUrl: string;
  sheetDataUrl: string;
  /** Human-readable preset label, used in download filenames. */
  presetLabel: string;
  /** Processing style id for timestamped download names (e.g. classic). */
  style?: string;
  /** Options shown on the checkout / success summary card. */
  summary?: PurchaseSummary;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available."));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed."));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
      if (!db.objectStoreNames.contains("photo-sessions")) {
        db.createObjectStore("photo-sessions", { keyPath: "photoId" });
      }
      if (!db.objectStoreNames.contains("generation-sessions")) {
        db.createObjectStore("generation-sessions", {
          keyPath: "generationId",
        });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    };
  });
}

export async function storePendingPurchase(purchase: PendingPurchase): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(purchase, PENDING_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed."));
  });
  db.close();
}

export async function readPendingPurchase(): Promise<PendingPurchase | null> {
  try {
    const db = await openDb();
    const purchase = await new Promise<PendingPurchase | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(PENDING_KEY);
      req.onsuccess = () => resolve((req.result as PendingPurchase | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed."));
    });
    db.close();
    return purchase;
  } catch (err) {
    console.warn("[purchaseStore] read failed:", err);
    return null;
  }
}

export async function clearPendingPurchase(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(PENDING_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("IndexedDB delete failed."));
    });
    db.close();
  } catch {
    // Non-fatal cleanup.
  }
}
