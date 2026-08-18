import {
  collection, doc, getDoc, getDocs,
  setDoc, orderBy, query,
} from 'firebase/firestore';
import { db } from './config';

export type Discipline = 'Frontend' | 'Backend' | 'Full-Stack' | 'Diseño' | 'DevOps' | 'QA' | 'Otro';

export type Member = {
  uid: string;
  name: string;
  role: string;
  orbit: string;
  discipline: Discipline;
  github: string;
  linkedin: string;
  photoUrl: string;
  order: number;
};

const COL = 'team';

export async function getMembers(): Promise<Member[]> {
  const q = query(collection(db, COL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Member);
}

export async function getMemberByUid(uid: string): Promise<Member | null> {
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  return snap.data() as Member;
}

/**
 * Crea o sobreescribe el perfil de un integrante.
 * El documento se guarda con el UID de Firebase Auth como ID.
 */
export async function saveMember(uid: string, data: Omit<Member, 'uid'>): Promise<void> {
  await setDoc(doc(db, COL, uid), { ...data, uid });
}
