// firebaseStorageService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService"; // Adjust the path as necessary

export const uploadFileAndGetURL = async (file) => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `excelFiles/${file.name}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    throw new Error("Error uploading file to storage: " + error.message);
  }
};
