import { collection, getDocs, query, limit, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Service = {
  id: string;
  catId: string;
  name: string;
  price: number;
  duration: string;
  tags: string[];
};

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "AC Repair", icon: "Snowflake" },
  { id: "c2", name: "Cleaning", icon: "Sparkles" },
  { id: "c3", name: "Plumbing", icon: "Droplet" },
  { id: "c4", name: "Electrician", icon: "Zap" },
  { id: "c5", name: "Painting", icon: "PaintRoller" },
  { id: "c6", name: "Salons", icon: "Scissors" },
];

const MOCK_SERVICES: Service[] = [
  { id: "s1", catId: "c1", name: "AC Regular Service", price: 599, duration: "45 mins", tags: ["Bestseller"] },
  { id: "s2", catId: "c2", name: "Deep Home Cleaning", price: 3499, duration: "6 hrs", tags: ["Premium"] },
  { id: "s3", catId: "c3", name: "Tap Repair", price: 199, duration: "30 mins", tags: [] },
  { id: "s4", catId: "c4", name: "Switchboard Fix", price: 149, duration: "30 mins", tags: [] },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);
    if (snapshot.empty) return MOCK_CATEGORIES;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (error) {
    console.warn("Firestore error fetching categories, falling back to mock data.", error);
    return MOCK_CATEGORIES;
  }
}

export async function getTopServices(): Promise<Service[]> {
  try {
    const servicesRef = collection(db, "services");
    const q = query(servicesRef, limit(10));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return MOCK_SERVICES;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  } catch (error) {
    console.warn("Firestore error fetching services, falling back to mock data.", error);
    return MOCK_SERVICES;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const docRef = doc(db, "services", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Service;
    }
    throw new Error("Not found in Firestore");
  } catch (error) {
    console.warn("Firestore error fetching service by id, falling back to mock.", error);
    const service = MOCK_SERVICES.find(s => s.id === id);
    if (service) return service;
    
    // Generic fallback for testing dynamic routes
    return {
      id,
      catId: "c1",
      name: `Premium Service ${id}`,
      price: 1499,
      duration: "2 hrs",
      tags: ["Recommended"]
    };
  }
}
