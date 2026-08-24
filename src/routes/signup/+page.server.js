import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { signupSchema } from './schema.js';

export async function load() {
	return { form: await superValidate(zod4(signupSchema)) };
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(signupSchema));

		const password = form.data.password;
		form.data.password = '';

		if (!form.valid) return fail(400, { form });

		// TODO: create the account (PocketBase has no users collection yet)
		void password;

		return message(form, 'Account created.');
	}
};
