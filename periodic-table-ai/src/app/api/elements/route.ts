import { NextResponse } from 'next/server';
import { db } from '@/app/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Element } from '@/types/elements';
import { getElementsByCategory, getElementById } from '@/utils/firebase';

export const dynamic = 'error';
export const dynamicParams = false;

// Generate static params for all possible routes
export async function generateStaticParams() {
  const elements = await getAllElements();
  const categories = [...new Set(elements.map(e => e.category))];
  const ids = elements.map(e => e.atomicNumber.toString());
  
  return [...categories, ...ids];
}

async function getAllElements() {
  const querySnapshot = await getDocs(collection(db, 'elements'));
  return querySnapshot.docs
    .map(doc => doc.data() as Element)
    .sort((a, b) => a.atomicNumber - b.atomicNumber);
}

export async function GET(request: Request, { params }: { params: { id?: string, category?: string } }) {
  try {
    if (params.id) {
      const element = await getElementById(params.id);
      if (element) {
        return NextResponse.json(element);
      }
      return NextResponse.json({ error: 'Element not found' }, { status: 404 });
    }

    if (params.category) {
      const elements = await getElementsByCategory(params.category);
      return NextResponse.json(elements);
    }

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