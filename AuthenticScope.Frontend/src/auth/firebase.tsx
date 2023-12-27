import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from "../config.json";
import { getDocs, getFirestore, query, where } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: config.apps.Firebase.apiKey,
    authDomain: config.apps.Firebase.authDomain,
    projectId: config.apps.Firebase.projectId,
    storageBucket: config.apps.Firebase.storageBucket,
    messagingSenderId: config.apps.Firebase.messagingSenderId,
    appId: config.apps.Firebase.appId,
    measurementId: config.apps.Firebase.measurementId
};

// const googleSignUpClientId = "319936913236-8ja32mq590prg8a41kk0qbbgbbsn1m82.apps.googleusercontent.com";
// const webClientSecret = "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";

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


const db = getFirestore(app);


export interface IHistoryEvent {
    userId: string;
    title: string;
    content: string | null;
    date: Date | string | any;
}

export const writeHistoryData = async (data: IHistoryEvent) => {
    const { userId, title } = data;

    try {
        // Query to check if a document with the same userId and title already exists
        const querySnapshot = await getDocs(
            query(collection(db, "history"),
                where("userId", "==", userId),
                where("title", "==", title)
            )
        );

        if (querySnapshot.empty) {
            // No matching document found, add the new document
            const docRef = await addDoc(collection(db, "history"), {
                data: data,
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log("Duplicate document not added.");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const readHistoryData = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, "history"), where("data.userId", "==", userId))
        );
        const newData = querySnapshot.docs.map((doc) => doc.data());
        return newData;
    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}

export const saveComment = async (user: any, title: string, comment: string) => {

    const collectionName = "comments"
    console.log(user);

    try {

        const querySnapshot = await getDocs(
            query(collection(db, collectionName),
                where("userId", "==", user.uid),
                where("title", "==", title)
            )
        );

        if (querySnapshot.empty) {

            const docRef = await addDoc(collection(db, collectionName), {
                user: {
                    userId: user.uid,
                    userName: user.displayName ?? user.email
                },
                title: title,
                comment: comment,
                date: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
        }


        console.log('This author already commented on this article');

    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }

}

export const readAllComments = async () => {

    try {

        const querySnapshot = await getDocs(
            query(collection(db, "comments"))
        );

        if (!querySnapshot.empty) {
            const newData = querySnapshot.docs.map((doc) => doc.data());
            return newData;
        }
        return [];

    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}

export const readComments = async (title: string) => {

    try {

        const querySnapshot = await getDocs(
            query(collection(db, "comments"),
                where("title", "==", title)
            )
        );

        if (!querySnapshot.empty) {
            const newData = querySnapshot.docs.map((doc) => doc.data());
            return newData;
        }
        return [];

    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}