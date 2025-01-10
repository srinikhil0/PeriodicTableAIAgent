import { readFileSync } from 'fs';
import { join } from 'path';
import { RSCClient } from '@/api/rsc/client';
import { elements } from '@/data/elements';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Read service account file
const serviceAccountPath = join(__dirname, '../../service-account-key.json');
const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf8')
);

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

const adminDb = admin.firestore();

export async function syncRSCData() {
  if (!process.env.RSC_API_KEY) {
    throw new Error('RSC_API_KEY is not configured');
  }
  const rscClient = new RSCClient(process.env.RSC_API_KEY);
  const batch = adminDb.batch();

  for (const element of elements) {
    try {
      const rscData = await rscClient.getElementData(element.symbol);
      
      const docRef = adminDb.collection('elements').doc(element.atomicNumber.toString());
      batch.update(docRef, {
        rscData: rscData,
        lastUpdated: new Date()
      });

      console.log(`Updated RSC data for ${element.name}`);
      // Respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error updating ${element.name}:`, error);
    }
  }

  await batch.commit();
  console.log('RSC data sync complete');
}

// Execute if this is the main module
if (require.main === module) {
  syncRSCData()
    .catch(error => {
      console.error('Sync failed:', error);
      process.exit(1);
    });
}
