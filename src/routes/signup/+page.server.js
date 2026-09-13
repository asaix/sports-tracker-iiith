import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schemas.js';

export async function load({ locals }) {
	if (locals.user) redirect(303, '/');

	return { form: await superValidate(zod4(signupSchema)) };
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(signupSchema));

		const { username, password, gender } = form.data;
		form.data.password = '';

		if (!form.valid) return fail(400, { form });

		try {
			await locals.pb.collection('users').create({
				username,
				password,
				passwordConfirm: password,
				gender
			});
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch (err) {
			if (err?.response?.data?.username) {
				return setError(form, 'username', 'That username is already taken.', { status: 409 });
			}
			return message(form, 'Could not create the account. Please try again.', { status: 500 });
		}

		try {
			const { code } = await locals.pb.send('/api/recovery/create', { method: 'POST' });
			return { form, recoveryCode: code.slice(0, 4) + '-' + code.slice(4) };
		} catch {
			redirect(303, '/');
		}
	}
};
