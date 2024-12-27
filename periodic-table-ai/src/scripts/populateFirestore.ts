import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as admin from 'firebase-admin';
import { elements } from '../data/elements';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read service account file
const serviceAccountPath = join(__dirname, '../../service-account-key.json');
const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf8')
);

// Initialize admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

async function populateFirestore() {
  try {
    for (const element of elements) {
      await db.collection('elements')
        .doc(element.atomicNumber.toString())
        .set(element);
      console.log(`Added element: ${element.name}`);
    }
    
    console.log('Database population complete!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await admin.app().delete();
  }
}

populateFirestore();