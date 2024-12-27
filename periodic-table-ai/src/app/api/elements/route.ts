import { NextResponse } from 'next/server';
import { db } from '@/app/config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Element } from '@/types/elements';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');

  try {
    let elements: Element[] = [];
    
    if (id) {
      const docRef = doc(db, 'elements', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return NextResponse.json(docSnap.data());
      }
      return NextResponse.json({ error: 'Element not found' }, { status: 404 });
    }

    const querySnapshot = await getDocs(collection(db, 'elements'));
    elements = querySnapshot.docs
      .map(doc => doc.data() as Element)
      .sort((a, b) => a.atomicNumber - b.atomicNumber);

    if (category) {
      elements = elements.filter(element => element.category === category);
    }

    return NextResponse.json(elements);
  } catch (error) {
    console.error('Error fetching elements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch elements' },
      { status: 500 }
    );
  }
}