import { z } from "zod";

export const SignupValidation = z.object({
	name: z.string().min(2, { message: "El nombre es demasiado corto" }),
	username: z.string().min(2, { message: "El nombre de usuario es demasiado corto" }),
	email: z.string().email({ message: "Correo electrónico no válido" }),
	password: z.string().min(6, { message: "La contraseña debe ser almenos de 6 caracteres" }),
});

export const SigninValidation = z.object({
	email: z.string().email({ message: "Correo electrónico no válido" }),
	password: z.string().min(6, { message: "La contraseña debe ser almenos de 6 caracteres" }),
});

export const PostValidation = z.object({
	caption: z
		.string()
		.min(5, { message: "La descripción es demasiado corta" })
		.max(250, { message: "La descripción es demasiado larga" }),
	file: z.custom<File[]>(),
	location: z
		.string()
		.min(2, { message: "La ubicación es demasiado corta" })
		.max(100, { message: "La ubicación es demasiado larga" }),
	tags: z.string(),
});
