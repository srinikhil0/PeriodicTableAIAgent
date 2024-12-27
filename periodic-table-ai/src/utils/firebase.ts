import { db } from '@/app/config/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Element } from '@/types/elements';

export async function getAllElements(): Promise<Element[]> {
  const snapshot = await getDocs(collection(db, 'elements'));
  return snapshot.docs.map(doc => doc.data() as Element)
    .sort((a, b) => a.atomicNumber - b.atomicNumber);
}

export async function getElementById(id: string): Promise<Element | null> {
  const docRef = doc(db, 'elements', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Element) : null;
}

export async function getElementsByCategory(category: string): Promise<Element[]> {
  const q = query(
    collection(db, 'elements'),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Element)
    .sort((a, b) => a.atomicNumber - b.atomicNumber);
}