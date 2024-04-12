import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useCreatePost } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
	post?: {
		caption: string;
		mediaUrl: string;
		location: string;
		tags: string[];
	};
};

const PostForm = ({ post }: PostFormProps) => {
	const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
	const { user } = useUserContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			caption: post ? post.caption : "",
			file: [],
			location: post ? post.location : "",
			tags: post ? post.tags.join(", ") : "",
		},
	});

	async function onSubmit(values: z.infer<typeof PostValidation>) {
		const newPost = await createPost({
			...values,
			userId: user.accountId,
		});

		if (!newPost) {
			toast({
				title: "Post creado exitosamente",
				description: "Your post has been created successfully",
			});
		}

		navigate("/");
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-9 w-full  max-w-5xl"
			>
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Caption</FormLabel>
							<FormControl>
								<Textarea className="shad-textarea custom-scrollbar" {...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Agregar Foto</FormLabel>
							<FormControl>
								<FileUploader fieldChange={field.onChange} mediaUrl={post?.mediaUrl ?? ""} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Agregar localidad</FormLabel>
							<FormControl>
								<Input type="text" className="shad-input" {...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">
								Agregar Etiquetas (separado por coma " , ")
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="shad-input"
									placeholder="Arte, Viajes, Aprendizaje"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<div className="flex gap-4 items-center justify-end">
					<Button type="button" className="shad-button_dark_4">
						Cancelar
					</Button>
					<Button type="submit" className="shad-button_primary whitespace-nowrap">
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
