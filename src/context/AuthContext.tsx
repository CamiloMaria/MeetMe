import { getCurrentUser } from "@/lib/firebase/api";
import { auth } from "@/lib/firebase/config";
import { IContextType, IUser } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
	accountId: "",
	email: "",
	name: "",
	username: "",
	bio: "",
	likedPosts: [],
	posts: [],
	saves: [],
	imageId: "",
	imageUrl: "",
	createdAt: "",
};

const INITIAL_STATE = {
	user: INITIAL_USER,
	isLoading: false,
	isAuthenticated: false,
	setUser: () => {},
	setIsAuthenticated: () => {},
	checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<IUser>(INITIAL_USER);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setIsLoading(true);
				try {
					const userDoc = await getCurrentUser();
					setUser(userDoc);
					setIsAuthenticated(true);
				} catch (error) {
					console.error("Error fetching user data:", error);
				} finally {
					setIsLoading(false);
				}
			} else {
				// No user is signed in
				navigate("/sign-in");
				setIsAuthenticated(false);
				setUser(INITIAL_USER);
				setIsLoading(false);
			}
		});

		return () => unsubscribe(); // Cleanup subscription
	}, [navigate]);

	const value = {
		user,
		isLoading,
		setUser,
		isAuthenticated,
		setIsAuthenticated,
		checkAuthUser: async () => {
			const userDoc = await getCurrentUser();
			if (userDoc) {
				setUser(userDoc);
				setIsAuthenticated(true);
				return true;
			}
			return false;
		},
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
