import { fail, redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.user) redirect(303, '/');
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '').trim().toLowerCase();
		const code = String(form.get('code') ?? '')
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, '');
		const password = String(form.get('password') ?? '');

		if (!username || !code) return fail(400, { message: 'Enter your username and recovery code.' });
		if (password.length < 8)
			return fail(400, { message: 'Password must be at least 8 characters.' });

		try {
			await locals.pb.send('/api/recovery/reset', {
				method: 'POST',
				body: { username, code, password }
			});
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch {
			return fail(400, { message: 'Incorrect username or recovery code.' });
		}

		redirect(303, '/');
	}
};
