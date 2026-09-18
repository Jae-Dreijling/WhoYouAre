import { openDB } from 'idb';
import { useEffect, useState } from 'react';

// Profile pictures and widget images live in IndexedDB, not localStorage —
// characters only ever store the image's id (see characterStore.js), so the
// structured data blob stays small no matter how many photos are added.

const DB_NAME = 'whoyouare-images';
const STORE_NAME = 'images';

let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }
  return dbPromise;
}

function makeImageId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Resizes/center-crops an image file down to a manageable blob before storage.
export function resizeImage(file, { maxSize = 640, square = false } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      let sx = 0;
      let sy = 0;
      let sw = width;
      let sh = height;

      if (square) {
        const side = Math.min(width, height);
        sx = (width - side) / 2;
        sy = (height - side) / 2;
        sw = side;
        sh = side;
        width = side;
        height = side;
      }

      const scale = Math.min(1, maxSize / Math.max(width, height));
      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Could not process image'))),
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };
    img.src = objectUrl;
  });
}

export async function putImage(blob) {
  const db = await getDb();
  const id = makeImageId();
  await db.put(STORE_NAME, blob, id);
  return id;
}

export async function getImageBlob(id) {
  if (!id) return null;
  const db = await getDb();
  return (await db.get(STORE_NAME, id)) ?? null;
}

export async function deleteImage(id) {
  if (!id) return;
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

// Loads an image by id from IndexedDB and exposes it as an object URL,
// cleaning up the URL whenever the id changes or the component unmounts.
export function useImageUrl(imageId) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    if (!imageId) {
      setUrl(null);
      return undefined;
    }

    getImageBlob(imageId).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageId]);

  return url;
}
