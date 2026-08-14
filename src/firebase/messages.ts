import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(input: ContactMessageInput): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    ...input,
    createdAt: serverTimestamp(),
  });
}
