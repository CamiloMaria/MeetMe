import { INewUser } from "@/types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "./config";
import { doc, setDoc } from "firebase/firestore";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await createUserWithEmailAndPassword(auth, user.email, user.password);

        if (newAccount) {
            const userId = newAccount.user.uid;

            const userDoc = {
                accountId: userId,
                email: user.email,
                name: user.name,
                username: user.username,
                bio: "",
                likedPosts: [],
                posts: [],
                saves: [],
                imageId: "",
                imageUrl: "",
                createdAt: new Date().toISOString(),
            }

            await setDoc(doc(fireStore, "users", userId), userDoc);
            localStorage.setItem("user", JSON.stringify(userDoc));

            // const postId = new Date().getTime().toString();
        
            // const postDoc = {
            //     postId: postId,
            //     creator: userId,
            //     likes: 0,
            //     caption: '',
            //     tags: [],
            //     imageId: '',
            //     imageUrl: '',
            //     location: '',
            //     saved: [],
            //     createdAt: new Date().toISOString(),
            // }

            // await setDoc(doc(fireStore, "posts", postId), postDoc);

            // const saves = {
            //     user: userId,
            //     savedPost: postId,
            // }

            // await setDoc(doc(fireStore, "saves", userId), saves);
        }

        return newAccount;
    } catch (error) {
        console.log(error);
        return error;
    }
}