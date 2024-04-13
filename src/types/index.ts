export type IContextType = {
	user: IUser
	isLoading: boolean
	setUser: React.Dispatch<React.SetStateAction<IUser>>
	isAuthenticated: boolean
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
	checkAuthUser: () => Promise<boolean>
}

export type INavLink = {
	imgURL: string
	route: string
	label: string
}

export type IUpdateUser = {
	userId: string
	name: string
	bio: string
	imageId: string
	imageUrl: URL | string
	file: File[]
}

export type IPost = {
	postId: string
	creator: string
	likes: []
	caption: string
	tags: string[]
	imageId: string
	imageUrl: string
	location: string
	saved: string[]
	createdAt: string
}

export type INewPost = {
	userId: string
	caption: string
	file: File[]
	location?: string
	tags?: string
}

export type IUpdatePost = {
	postId: string
	caption: string
	imageId: string
	imageUrl: URL
	file: File[]
	location?: string
	tags?: string
}

export type IUser = {
	accountId: string
	email: string
	name: string
	username: string
	bio: string
	likedPosts: string[]
	posts: string[]
	saves: string[]
	imageId: string
	imageUrl: string
	createdAt: string
}

export type INewUser = {
	name: string
	email: string
	username: string
	password: string
}

export type ISaves = {
	savesId: string
	postId: string
	userId: string
}
