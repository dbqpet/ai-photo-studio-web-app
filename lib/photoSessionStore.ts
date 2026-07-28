/**
 * Client-side studio session persistence so Stripe redirects can restore
 * the generated preview (and unlock state) without re-upload.
 *
 * Upload session ≠ generation:
 * - uploadSessionId: stable for one source photo upload
 * - generationId: unique per successful AI output (unlock is bound to this)
 */

import type { SheetLayout } from "@/lib/printLayout";
import type { AiProvider, BackgroundMode, ProcessingMode } from "@/lib/types";
import type { PurchaseSummary } from "@/lib/purchaseStore";

const DB_NAME = "ai-studio-id";
const DB_VERSION = 3;
const SESSION_STORE = "generation-sessions";
const LEGACY_SESSION_STORE = "photo-sessions";
const ACTIVE_KEY = "active-generation-id";
const META_STORE = "meta";

export interface GeneratedResultSession {
  provider: AiProvider;
  cleanSingle: string;
  cleanSheet: string;
  previewSingle: string;
  previewSheet: string;
  layout: SheetLayout;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
}

export interface PhotoSession {
  /** Unique id for this AI output — unlock / payment is bound here. */
  generationId: string;
  /** Stable id for the current source-photo upload (not used for unlock). */
  uploadSessionId: string;
  sourcePhoto: string;
  resolutionWarning?: string;
  presetId: string;
  customWidthMm: number;
  customHeightMm: number;
  backgroundId: string;
  backgroundMode: BackgroundMode;
  mode: ProcessingMode;
  result: GeneratedResultSession;
  summary: PurchaseSummary;
  presetLabel: string;
  unlocked: boolean;
  downloaded: boolean;
  updatedAt: number;
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
      if (!db.objectStoreNames.contains("pending-purchase")) {
        db.createObjectStore("pending-purchase");
      }
      if (!db.objectStoreNames.contains(LEGACY_SESSION_STORE)) {
        db.createObjectStore(LEGACY_SESSION_STORE, { keyPath: "photoId" });
      }
      if (!db.objectStoreNames.contains(SESSION_STORE)) {
        db.createObjectStore(SESSION_STORE, { keyPath: "generationId" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    };
  });
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Stable id for one uploaded source photo. */
export function createUploadSessionId(): string {
  return newId("upload");
}

/** Unique id for one successful AI generation result (unlock key). */
export function createGenerationId(): string {
  return newId("gen");
}

/** @deprecated Use createGenerationId — kept for call-site clarity during rename. */
export function createPhotoId(): string {
  return createGenerationId();
}

export async function savePhotoSession(session: PhotoSession): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([SESSION_STORE, META_STORE], "readwrite");
    tx.objectStore(SESSION_STORE).put(session);
    tx.objectStore(META_STORE).put(session.generationId, ACTIVE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed."));
  });
  db.close();
}

function normalizeSession(raw: unknown): PhotoSession | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;

  // New shape
  if (typeof row.generationId === "string" && row.result) {
    return row as unknown as PhotoSession;
  }

  // Legacy shape keyed by photoId
  if (typeof row.photoId === "string" && row.result) {
    const legacy = row as unknown as PhotoSession & { photoId: string };
    return {
      ...legacy,
      generationId: legacy.photoId,
      uploadSessionId:
        typeof row.uploadSessionId === "string"
          ? row.uploadSessionId
          : legacy.photoId,
    };
  }

  return null;
}

export async function readPhotoSession(
  generationId: string,
): Promise<PhotoSession | null> {
  try {
    const db = await openDb();
    const fromNew = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(SESSION_STORE, "readonly");
      const req = tx.objectStore(SESSION_STORE).get(generationId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed."));
    });
    let session = normalizeSession(fromNew);

    if (!session && db.objectStoreNames.contains(LEGACY_SESSION_STORE)) {
      const fromLegacy = await new Promise<unknown>((resolve, reject) => {
        const tx = db.transaction(LEGACY_SESSION_STORE, "readonly");
        const req = tx.objectStore(LEGACY_SESSION_STORE).get(generationId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () =>
          reject(req.error ?? new Error("IndexedDB read failed."));
      });
      session = normalizeSession(fromLegacy);
    }

    db.close();
    return session;
  } catch (err) {
    console.warn("[photoSession] read failed:", err);
    return null;
  }
}

export async function readActivePhotoSession(): Promise<PhotoSession | null> {
  try {
    const db = await openDb();
    const generationId = await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(META_STORE, "readonly");
      const req = tx.objectStore(META_STORE).get(ACTIVE_KEY);
      req.onsuccess = () =>
        resolve((req.result as string | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed."));
    });

    // Fall back to legacy active key
    let id = generationId;
    if (!id) {
      id = await new Promise<string | null>((resolve, reject) => {
        const tx = db.transaction(META_STORE, "readonly");
        const req = tx.objectStore(META_STORE).get("active-photo-id");
        req.onsuccess = () =>
          resolve((req.result as string | undefined) ?? null);
        req.onerror = () =>
          reject(req.error ?? new Error("IndexedDB read failed."));
      });
    }

    db.close();
    if (!id) return null;
    return readPhotoSession(id);
  } catch {
    return null;
  }
}

export async function markPhotoSessionUnlocked(
  generationId: string,
): Promise<PhotoSession | null> {
  const session = await readPhotoSession(generationId);
  if (!session) return null;
  const next = { ...session, unlocked: true, updatedAt: Date.now() };
  await savePhotoSession(next);
  return next;
}

export async function markPhotoSessionDownloaded(
  generationId: string,
): Promise<PhotoSession | null> {
  const session = await readPhotoSession(generationId);
  if (!session) return null;
  const next = {
    ...session,
    unlocked: true,
    downloaded: true,
    updatedAt: Date.now(),
  };
  await savePhotoSession(next);
  return next;
}
