import { INewPost, INewUser, IUser } from "@/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore, storage } from "./config";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function createUserAccount(user: INewUser) {
	try {
		const newAccount = await createUserWithEmailAndPassword(auth, user.email, user.password);

		if (!newAccount) {
			throw Error;
		}

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
		};

		await saveToDatabase<any>("users", userId, userDoc);
		localStorage.setItem("user", JSON.stringify(userDoc));

		// const postId = new Date().getTime().toString()

		// const postDoc = {
		// 	postId: postId,
		// 	creator: userId,
		// 	likes: 0,
		// 	caption: "",
		// 	tags: [],
		// 	imageId: "",
		// 	imageUrl: "",
		// 	location: "",
		// 	saved: [],
		// 	createdAt: new Date().toISOString(),
		// }

		// await saveToDatabase("posts", postId, postDoc)

		// const savesId = new Date().getTime().toString()

		// const saves = {
		// 	savesId,
		// 	user: userId,
		// 	savedPost: postId,
		// }

		// await saveToDatabase("saves", userId, saves)

		return newAccount;
	} catch (error) {
		return error;
	}
}

export async function saveToDatabase<T extends { [key: string]: any }>(
	collection: string,
	docId: string,
	data: T
) {
	try {
		await setDoc(doc(fireStore, collection, docId), data);
		console.log(`Data saved to ${collection} with ID ${docId}`);
	} catch (error) {
		console.error(`Error saving data to ${collection}:`, error);
		throw error;
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await signInWithEmailAndPassword(auth, user.email, user.password);

		if (!session) {
			throw Error;
		}

		return session;
	} catch (error) {
		throw error;
	}
}

export async function getCurrentUser(): Promise<IUser> {
	try {
		const user = auth.currentUser;

		if (!user) {
			throw new Error("No user is currently logged in.");
		}

		const usersRef = collection(fireStore, "users");
		const q = query(usersRef, where("accountId", "==", user.uid));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("No document found for the current user.");
		}

		const userDoc = querySnapshot.docs[0].data() as IUser;
		console.log(userDoc);

		return userDoc;
	} catch (error) {
		throw error;
	}
}

export async function signOutAccount() {
	try {
		await auth.signOut();
		localStorage.removeItem("user");
	} catch (error) {
		throw error;
	}
}

export async function createPost(post: INewPost) {
	try {
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) {
			throw new Error("Failed to upload file");
		}

		// Check if the file was uploaded but URL is missing, then delete the file
        if (!uploadedFile || !uploadedFile.url) {
            if (uploadedFile && uploadedFile.id) {
                await deleteFile(uploadedFile.id, post.file[0].name);
            }
            throw new Error("Failed to upload file or get URL");
        }

		const postId = new Date().getTime().toString();
		const tags = post.tags?.replace(/ /g, "").split(",") || [];
		const postDoc = {
			postId,
			creator: post.userId,
			likes: 0,
			caption: post.caption,
			tags,
			imageId: uploadedFile.id,
			imageUrl: uploadedFile.url,
			location: post.location,
			saved: [],
			createdAt: new Date().toISOString(),
		};

		await saveToDatabase("posts", postId, postDoc);

		return postDoc;
	} catch (error) {
		throw error;
	}
}

export async function uploadFile(file: File) {
	const fileId = new Date().getTime().toString();
	const uploadFileRef = ref(storage, `posts/${fileId}-${file.name}`);
	try {
		const uploadedFile = await uploadBytes(uploadFileRef, file);

		// Get the download URL
		const downloadURL = await getDownloadURL(uploadedFile.ref);

		return { id: fileId, path: uploadedFile.metadata.fullPath, url: downloadURL };
	} catch (error) {
		throw error;
	}
}

export async function deleteFile(fileId: string, fileName: string) {
	try {
		const filePath = `posts/${fileId}-${fileName}`;
		const fileRef = ref(storage, filePath);

		await deleteObject(fileRef);
	
		return { status: "ok" };
	} catch (error) {
	}
}
