import React from "react";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser, useGetPostsByIDs } from "@/lib/react-query/queries";
import { IPost } from "@/types";

const Saved = () => {
	const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUser();

	if (isCurrentUserLoading) {
		return <Loader />;
	}

	if (!currentUser) {
		return <div>No user data available.</div>;
	}

	const postIds = currentUser.saves.map((save) => save);
	const { data: savedPosts, isLoading: isPostsLoading } = useGetPostsByIDs(postIds);

	if (isPostsLoading) {
		return <Loader />;
	}

	if (!savedPosts || savedPosts.length === 0) {
		return <div className="text-center text-light-4">No saved posts available.</div>;
	}

	return (
		<div className="saved-container">
			<div className="flex gap-2 w-full max-w-5xl">
				<img
					src="/assets/icons/save.svg"
					width={36}
					height={36}
					alt="edit"
					className="invert-white"
				/>
				<h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
			</div>

			<ul className="w-full flex justify-center max-w-5xl gap-9">
				<GridPostList posts={savedPosts} showStats={false} />
			</ul>
		</div>
	);
};

export default Saved;
