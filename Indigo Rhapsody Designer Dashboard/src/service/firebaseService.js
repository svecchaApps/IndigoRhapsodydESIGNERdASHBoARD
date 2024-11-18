// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const uploadImageToFirebase = async (file, folder) => {
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  try {
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);

    // Get the download URL for the uploaded file
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
export const messaging = getMessaging(firebaseApp);

export const getFcmToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY",
    });
    if (currentToken) {
      return currentToken;
    } else {
      console.warn(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// firebaseService.js
