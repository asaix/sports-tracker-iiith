import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas.js';

export async function load({ locals }) {
	if (locals.user) redirect(303, '/');

	return { form: await superValidate(zod4(loginSchema)) };
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(loginSchema));

		const { username, password } = form.data;
		form.data.password = '';

		if (!form.valid) return fail(400, { form });

		try {
			// populates locals.pb.authStore, which hooks.server.js writes to the cookie
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch {
			return message(form, 'Incorrect username or password.', { status: 401 });
		}

		redirect(303, '/');
	}
};
