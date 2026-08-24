import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import PocketBase from 'pocketbase';

const PB_URL = env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function handle({ event, resolve }) {
	const pb = new PocketBase(PB_URL);
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');

	try {
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		}
	} catch (err) {
		if (err?.status >= 400 && err?.status < 500) pb.authStore.clear(); // don't if DB down
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.record;

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: true, secure: !dev, sameSite: 'lax', path: '/' })
	);

	return response;
}
