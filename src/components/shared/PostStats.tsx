import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
	useLikePost,
	useSavePost,
	useDeleteSavedPost,
	useGetCurrentUser,
	useGetSavedPosts,
} from "@/lib/react-query/queries";
import { IPost, ISaves } from "@/types";
import Loader from "./Loader";

type PostStatsProps = {
	post: IPost;
	userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
	const location = useLocation();

	const likesList = post.likes || [];
	const [likes, setLikes] = useState<string[]>(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const { mutate: likePost } = useLikePost();
	const { mutate: savePost, isPending: isSavingPost } = useSavePost();
	const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavedPost();

	const { data: savedPost } = useGetSavedPosts(userId);
	const { data: currentUser } = useGetCurrentUser();

	const savedPostRecord = savedPost?.find((save: ISaves) => save.postId === post.postId);

	useEffect(() => {
		setIsSaved(!!savedPostRecord);
	}, [currentUser]);

	const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		e.stopPropagation();

		let likesArray = [...likes];

		if (likesArray.includes(userId)) {
			likesArray = likesArray.filter((Id) => Id !== userId);
		} else {
			likesArray.push(userId);
		}

		setLikes(likesArray);
		likePost({ postId: post.postId, likesArray });
	};

	const handleSavePost = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		e.stopPropagation();

		// If the post is currently saved, attempt to delete it.
		if (isSaved && savedPostRecord) {
			setIsSaved(false); // Optimistically set isSaved to false
			deleteSavePost(
				{ savedId: savedPostRecord.savesId, userId: userId, postId: post.postId },
				{
					onSuccess: () => {
						// Handle successful deletion, if specific actions needed
					},
					onError: () => {
						setIsSaved(true); // Revert state if deletion fails
					},
				}
			);
		} else {
			setIsSaved(true); // Optimistically set isSaved to true
			savePost(
				{ userId: userId, postId: post.postId },
				{
					onSuccess: () => {
						// Handle successful save, if specific actions needed
					},
					onError: () => {
						setIsSaved(false); // Revert state if saving fails
					},
				}
			);
		}
	};

	const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";

	return (
		<div className={`flex justify-between items-center z-20 ${containerStyles}`}>
			<div className="flex gap-2 mr-5">
				<img
					src={`${
						checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
					}`}
					alt="like"
					width={20}
					height={20}
					onClick={(e) => handleLikePost(e)}
					className="cursor-pointer"
				/>
				<p className="small-medium lg:base-medium">{likes.length}</p>
			</div>

			<div className="flex gap-2">
				{isSavingPost || isDeletingSaved ? (
					<Loader />
				) : (
					<img
						src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
						alt="share"
						width={20}
						height={20}
						className="cursor-pointer"
						onClick={(e) => {
							if (!isSavingPost && !isDeletingSaved) {
								handleSavePost(e);
							}
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default PostStats;
