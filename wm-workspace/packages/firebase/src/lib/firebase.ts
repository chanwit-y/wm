
import { app, database } from './config';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  DocumentData,
  getFirestore,
  CollectionReference,
  setDoc,
  updateDoc,
  where,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

export function firebase(): string {
  return 'firebase';
}

export async function getDataAll(collectionName: string) {
  const docDatum = await getDocs(createCollection(collectionName));
  return docDatum.docs.map((doc) => doc.data());
}

export async function getDataById(collectionName: string, id: string) {
  const docs = doc(database, collectionName, id);
  const docData = await getDoc(docs);
  return docData.data();
}

export async function getDataFilter(
  collectionName: string,
  filter: Map<string, any>
) {
  let result: any[] = [];
  let wheres: QueryConstraint[] = [];
  for (const [key, value] of filter.entries())
    wheres = [...wheres, where(key, '==', value)];

  const q = query(createCollection(collectionName), ...wheres);
  const docs = await getDocs(q);
  docs.forEach((d) => (result = [...result, { doc_id: d.id, ...d.data() }]));
  return result;
}

export const firestore = getFirestore(app);
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export async function addData(collectionName: string, data: any) {
  const userRef = doc(createCollection(`${collectionName}`));
  await setDoc(userRef, data);
}

export const updateData = async (
  collectionName: string,
  id: string,
  field: string,
  value: unknown,
  ...moreFieldsAndValues: unknown[]
) => {
  const userRef = doc(database, collectionName, id);
  await updateDoc(userRef, field, value, ...moreFieldsAndValues);
};

