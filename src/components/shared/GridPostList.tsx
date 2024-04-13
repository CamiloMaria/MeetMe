import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useUserContext } from "@/context/AuthContext";
import { IPost } from "@/types";

type GridPostListProps = {
	posts: IPost[];
	showUser?: boolean;
	showStats?: boolean;
};

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
	const { user } = useUserContext();

	return (
		<ul className="grid-container">
			{posts.map((post) => (
				<li key={post.postId} className="relative min-w-80 h-80">
					<Link to={`/posts/${post.postId}`} className="grid-post_link">
						<img src={post.imageUrl} alt="post" className="h-full w-full object-cover" />
					</Link>

					<div className="grid-post_user">
						{showUser && (
							<div className="flex items-center justify-start gap-2 flex-1">
								<img
									src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
									alt="creator"
									className="w-8 h-8 rounded-full"
								/>
								<p className="line-clamp-1">{user.name}</p>
							</div>
						)}
						{showStats && <PostStats post={post} userId={user.accountId} />}
					</div>
				</li>
			))}
		</ul>
	);
};

export default GridPostList;
