import { initializeApp, getApps, getApp } from "firebase/app";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@dataconnect/example";

const firebaseConfig = {
  projectId: "haptome-72690",
  appId: "1:618113367652:web:9ab05dc56988598a92e971",
  storageBucket: "haptome-72690.firebasestorage.app",
  apiKey: "AIzaSyD5CLFWe80KZbCHE9bnGq5MuT3nLbDYrnI",
  authDomain: "haptome-72690.firebaseapp.com",
  messagingSenderId: "618113367652",
  measurementId: "G-EJLTFGQ2RY"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Data Connect
const dataConnect = getDataConnect(app, connectorConfig);

// Connect to local emulator during development
if (process.env.NODE_ENV === "development") {
  connectDataConnectEmulator(dataConnect, 'localhost', 9399);
}

export { app, dataConnect };
