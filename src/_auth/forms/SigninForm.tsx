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
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
	const { toast } = useToast();
	const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
	const navigate = useNavigate();

	const { mutateAsync: signInAccount, isPending } = useSignInAccount();

	const form = useForm<z.infer<typeof SigninValidation>>({
		resolver: zodResolver(SigninValidation),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof SigninValidation>) {
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
				{/* <img src="/assets/images/iqs-logo.png" /> */}

				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Iniciar sesión</h2>
				<p className="text-secondary-500 small-medium md:base-regular mt-2">
					Bienvenido de vuelta! Ingresa tus datos para iniciar sesión.
				</p>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Correo</FormLabel>
								<FormControl>
									<Input type="email" className="shad-input" {...field} />
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
								<FormLabel className="shad-form_label">Contraseña</FormLabel>
								<FormControl>
									<Input type="password" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{isUserLoading ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : (
							"Iniciar sesión"
						)}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
						¿No tienes una cuenta?{" "}
						<Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">
							Regístrate
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SigninForm;
