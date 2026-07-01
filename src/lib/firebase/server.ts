import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let _adminAuth: ReturnType<typeof getAuth> | null = null;

export function getAdminAuth() {
  if (!_adminAuth) {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!clientEmail || !privateKey || !projectId) {
      throw new Error('Firebase Admin SDK env vars not set (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID)');
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
    _adminAuth = getAuth(getApps()[0]);
  }
  return _adminAuth;
}
