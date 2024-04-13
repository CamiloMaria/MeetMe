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
import { IPost, ISaves, IUser } from "@/types";

type PostStatsProps = {
	post: IPost;
	userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
	const location = useLocation();
	console.log(post.likes);
	const likesList = post.likes.map((user: IUser) => user.accountId);

	const [likes, setLikes] = useState<string[]>(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const { mutate: likePost } = useLikePost();
	const { mutate: savePost } = useSavePost();
	const { mutate: deleteSavePost } = useDeleteSavedPost();

	const { data: savedPost } = useGetSavedPosts(userId);
	const { data: currentUser } = useGetCurrentUser();

	const savedPostRecord = savedPost?.find((saved: ISaves) => saved.postId === post.postId);

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

	const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		e.stopPropagation();

		if (savedPostRecord) {
			setIsSaved(false);
			return deleteSavePost(savedPostRecord.savesId);
		}

		savePost({ userId: userId, postId: post.postId });
		setIsSaved(true);
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
				<img
					src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
					alt="share"
					width={20}
					height={20}
					className="cursor-pointer"
					onClick={(e) => handleSavePost(e)}
				/>
			</div>
		</div>
	);
};

export default PostStats;
