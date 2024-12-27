import { NextResponse } from 'next/server';
import { db } from '@/app/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Element } from '@/types/elements';

// For static export, we'll use static data generation
export const dynamic = 'force-static';

// Function to get all elements at build time
async function getAllElements() {
  const querySnapshot = await getDocs(collection(db, 'elements'));
  return querySnapshot.docs
    .map(doc => doc.data() as Element)
    .sort((a, b) => a.atomicNumber - b.atomicNumber);
}

// GET handler for static paths
export async function GET() {
  try {
    const elements = await getAllElements();
    return NextResponse.json(elements);
  } catch (error) {
    console.error('Error fetching elements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch elements' },
      { status: 500 }
    );
  }
}