import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPost,
	createUserAccount,
	deletePost,
	deleteSavedPost,
	getCurrentUser,
	getInfinitePosts,
	getPostById,
	getPostsByIds,
	getRecentPosts,
	getSavedPosts,
	getUserById,
	getUserPosts,
	likePost,
	savePost,
	signInAccount,
	signOutAccount,
} from "../firebase/api";
import { INewPost, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
};

export const useSignInAccount = () => {
	return useMutation({
		mutationFn: (user: { email: string; password: string }) => signInAccount(user),
	});
};

export const useSignOutAccount = () => {
	return useMutation({
		mutationFn: signOutAccount,
	});
};

export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: getCurrentUser,
	});
};

export const useGetUserById = (userId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
		queryFn: () => getUserById(userId),
	});
};

export const useGetPostsByIDs = (postIds: string[]) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POSTS_BY_IDS, postIds],
		queryFn: () => getPostsByIds(postIds),
	});
}

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post: INewPost) => createPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetRecentPosts = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: getRecentPosts,
	});
};

// export const useGetPosts = () => {
// 	return useInfiniteQuery({
// 		queryKey: [QUERY_KEYS.GET_POSTS],
// 		queryFn: getInfinitePosts,
// 		getNextPageParam: (lastPage) => {
// 			return lastPage[lastPage.length - 1].postId;
// 		}
// 	});
// };

export const useGetPostById = (postId?: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
		queryFn: () => getPostById(postId),
		enabled: !!postId,
	});
};

export const useGetUserPosts = (userId?: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
		queryFn: () => getUserPosts(userId),
		enabled: !!userId,
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ postId, imageId }: { postId?: string; imageId?: string }) =>
			deletePost(postId, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useLikePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) =>
			likePost(postId, likesArray),
		onSuccess: (data: any) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.postId],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useGetSavedPosts = (userId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
		queryFn: () => getSavedPosts(userId),
	});
};

export const useSavePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
			savePost(userId, postId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useDeleteSavedPost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			savedId,
			userId,
			postId,
		}: {
			savedId: string;
			userId: string;
			postId: string;
		}) => deleteSavedPost(savedId, userId, postId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};
