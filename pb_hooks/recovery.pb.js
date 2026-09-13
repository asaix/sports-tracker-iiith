/// <reference path="../pb_data/types.d.ts" />

routerAdd(
	'POST',
	'/api/recovery/create',
	(e) => {
		if (e.auth.getString('recoveryKey')) throw new BadRequestError('Already set.');
		const code = $security.randomStringWithAlphabet(8, 'ABCDEFGHJKMNPQRSTUVWXYZ23456789');
		e.auth.set('recoveryKey', $security.sha256(e.auth.getString('username') + ':' + code));
		e.app.save(e.auth);
		return e.json(200, { code: code });
	},
	$apis.requireAuth('users')
);

routerAdd('POST', '/api/recovery/reset', (e) => {
	const body = e.requestInfo().body;
	let user;
	try {
		user = e.app.findFirstRecordByData('users', 'username', body.username);
	} catch (err) {
		throw new BadRequestError('Invalid.');
	}
	const key = user.getString('recoveryKey');
	const hash = $security.sha256(user.getString('username') + ':' + body.code);
	if (!key || !$security.equal(key, hash)) throw new BadRequestError('Invalid.');
	user.setPassword(body.password);
	e.app.save(user);
	return e.noContent(204);
});
