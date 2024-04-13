import { INewPost, INewUser, IPost, ISaves, IUser } from "@/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore, storage } from "./config";
import { collection, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
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
			saves: [],
			imageId: "",
			imageUrl: "",
			createdAt: new Date().toISOString(),
		};

		await saveToDatabase<any>("users", userId, userDoc);

		const token = await newAccount.user.getIdToken();
		localStorage.setItem("user", JSON.stringify(token));

		return newAccount;
	} catch (error) {
		return error;
	}
}

export async function saveToDatabase<T extends { [key: string]: any }>(
	collection: string,
	docId: string,
	data: T,
	overwrite: boolean = true
) {
	try {
		const docRef = doc(fireStore, collection, docId);
		if (overwrite) {
			await setDoc(docRef, data);
		} else {
			await updateDoc(docRef, data);
		}
		console.log(`Data saved to ${collection} with ID ${docId}`);
	} catch (error) {
		console.error(`Error saving data to ${collection}:`, error);
		throw error;
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await signInWithEmailAndPassword(auth, user.email, user.password).catch(
			(error) => {
				throw error;
			}
		);

		if (!session) {
			throw Error;
		}

		const token = await session.user.getIdToken();
		localStorage.setItem("user", JSON.stringify(token));

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

		return userDoc;
	} catch (error) {
		throw error;
	}
}

export async function getUserById(userId: string): Promise<IUser> {
	try {
		const usersRef = collection(fireStore, "users");
		const q = query(usersRef, where("accountId", "==", userId));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("No document found for the user.");
		}

		const userDoc = querySnapshot.docs[0].data() as IUser;

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

export async function getUserPosts(userId?: string) {
	if (!userId) return;

	try {
		const postsRef = collection(fireStore, "posts");
		const q = query(postsRef, where("creator", "==", userId));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("No posts found");
		}

		const posts = querySnapshot.docs.map((doc) => doc.data()) as IPost[];

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function getRecentPosts() {
	try {
		const postsRef = collection(fireStore, "posts");
		const q = query(postsRef, orderBy("createdAt", "desc"), limit(20));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("No posts found");
		}

		const posts = querySnapshot.docs.map((doc) => doc.data()) as IPost[];

		return posts;
	} catch (error) {
		throw error;
	}
}

export async function getPostById(postId?: string) {
	if (!postId) throw Error;

	try {
		const postRef = collection(fireStore, "posts");
		const q = query(postRef, where("postId", "==", postId));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("No post found");
		}

		const postDoc = querySnapshot.docs[0];

		return postDoc.data() as IPost;
	} catch (error) {
		console.log(error);
	}
}

export async function createPost(post: INewPost) {
	try {
		const user = await getCurrentUser();

		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) {
			throw new Error("Failed to upload file");
		}

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
			likes: [],
			caption: post.caption,
			tags,
			imageId: uploadedFile.id,
			imageUrl: uploadedFile.url,
			location: post.location,
			saved: [],
			userId: user.accountId,
			createdAt: new Date().toISOString(),
		};

		console.log(postDoc);

		await saveToDatabase("posts", postId, postDoc);

		return postDoc;
	} catch (error) {
		throw error;
	}
}

export async function likePost(postId: string, likesArray: string[]) {
	try {
		const user = await getCurrentUser();

		await saveToDatabase("posts", postId, { likes: likesArray }, false);
		await saveToDatabase("users", user.accountId, { likedPosts: [postId] }, false);

		return { status: "ok" };
	} catch (error) {
		throw error;
	}
}

export async function getSavedPosts(userId: string) {
	try {
		const savesRef = collection(fireStore, "saves");
		const q = query(savesRef, where("user", "==", userId));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("No saved posts found");
		}

		const savedPosts = querySnapshot.docs.map((doc) => doc.data()) as ISaves[];

		return savedPosts;
	} catch (error) {
		throw error;
	}
}

export async function savePost(userId: string, postId: string) {
	try {
		const savesId = new Date().getTime().toString();
		const saves = {
			savesId,
			user: userId,
			savedPost: postId,
		};

		await saveToDatabase("saves", userId, saves);

		return saves;
	} catch (error) {
		throw error;
	}
}

export async function deleteSavedPost(saveId: string) {
	try {
		await saveToDatabase("saves", saveId, {});

		return { status: "ok" };
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
		throw error;
	}
}
