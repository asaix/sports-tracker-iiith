import { z } from 'zod';

export const genders = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' }
];

export const signupSchema = z
	.object({
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters.')
			.max(32, 'Username must be at most 32 characters.')
			.regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores.'),
		password: z.string().min(8, 'Password must be at least 8 characters.'),
		gender: z.enum(['', 'male', 'female']).default('')
	})
	.refine((data) => data.gender !== '', {
		message: 'Please select a gender.',
		path: ['gender']
	});

export const loginSchema = z.object({
	username: z.string().min(1, 'Enter your username.'),
	password: z.string().min(1, 'Enter your password.')
});
