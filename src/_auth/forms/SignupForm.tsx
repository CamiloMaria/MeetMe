import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
	useCreateUserAccount,
	useSignInAccount,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
	const { toast } = useToast();
	const { checkAuthUser, isLoading: isUserLoading } =
		useUserContext();
	const navigate = useNavigate();

	const {
		mutateAsync: createUserAccount,
		isPending: isCreatingUser,
	} = useCreateUserAccount();

	const {
		mutateAsync: signInAccount,
		isPending: isSigningIn,
	} = useSignInAccount();

	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(
		values: z.infer<typeof SignupValidation>
	) {
		const newUser = await createUserAccount(values);

		if (!newUser) {
			return toast({
				title: "Ocurrió un error",
				description: "No se pudo crear la cuenta",
			});
		}

		const session = await signInAccount({
			email: values.email,
			password: values.password,
		});

		if (!session) {
			return toast({
				title: "Ocurrió un error",
				description: "No se pudo iniciar sesión",
			});
		}

		const isLoggedIn = await checkAuthUser();

		if (isLoggedIn) {
			form.reset();

			navigate("/");
		} else {
			toast({
				title: "Ocurrió un error",
				description: "No se pudo iniciar sesión",
			});
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img src="/assets/images/logo.svg" />

				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
					Crea una cuenta
				</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">
					Para usar MeetMe necesitas una cuenta. Digite tus
					datos.
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5 w-full mt-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Nombre
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Usuario
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Correo
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Contraseña
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="shad-button_primary"
					>
						{isCreatingUser ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : (
							"Registrarse"
						)}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
						¿Ya tienes una cuenta?{" "}
						<Link
							to="/sign-in"
							className="text-primary-500 text-small-semibold ml-1"
						>
							Inicia sesión
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SignupForm;
