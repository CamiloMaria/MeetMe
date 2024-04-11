import { INewUser } from "@/types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "./config";
import { doc, setDoc } from "firebase/firestore";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await createUserWithEmailAndPassword(auth, user.email, user.password);

        if (newAccount) {
            const userDoc = {
                uuid: newAccount.user?.uid,
                name: user.name,
                username: user.username,
                email: user.email,
                createdAt: new Date().toISOString(),
            }

            await setDoc(doc(fireStore, "users", newAccount.user?.uid), userDoc);
            localStorage.setItem("user", JSON.stringify(userDoc));
        }

        return newAccount;
    } catch (error) {
        console.log(error);
        return error;
    }
}