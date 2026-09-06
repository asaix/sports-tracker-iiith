import { fail, redirect } from '@sveltejs/kit';

const MALE_REQUIREMENT = 34;
const FEMALE_REQUIREMENT = 32;
const SEMESTER_START = new Date(2026, 7, 1);

export async function load({ locals }) {
	if (!locals.user) redirect(303, '/login');

	var pb = locals.pb;
	console.log(pb.authStore.isValid);
	console.log(pb.authStore.token);
	console.log(pb.authStore.record.id);

	const requirement = locals.user.gender === 'male' ? MALE_REQUIREMENT : FEMALE_REQUIREMENT;

	// attendance log
	const attendance = await pb.collection('attendance').getFullList({
		fields: 'id, date, present',
		sort: '-date'
	});

	const dayKey = (d) =>
		`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

	const byDay = new Map(attendance.map((r) => [dayKey(new Date(r.date)), r]));

	const log = [];
	for (let d = new Date(SEMESTER_START); d <= new Date(); d.setDate(d.getDate() + 1)) {
		const record = byDay.get(dayKey(d));
		log.push({
			day: dayKey(d),
			date: new Date(d),
			id: record?.id ?? null,
			status: record ? (record.present ? 'Present' : 'Absent') : '-'
		});
	}

	const extra = await pb.collection('extra').getFullList({
		fields: 'id, count, reason'
	});

	const leave = await pb.collection('leave').getFullList({
		fields: 'id, count, reason'
	});

	return {
		attendanceLog: log.reverse(),
		extra,
		leave,
		standard: attendance.filter((r) => r.present).length,
		requirement
	};
}

export const actions = {
	ma: async ({ request, locals }) => {
		// Mark attendance
		let pb = locals.pb;

		const form = await request.formData();
		const day = String(form.get('day'));
		const status = String(form.get('status'));
		const id = String(form.get('id')); // record id NOT user id

		if (!locals.user) return fail(401, { message: 'Unauthorized' });
		if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return fail(400, { message: 'Bad date.' });
		if (!['Present', 'Absent', '-'].includes(status)) return fail(400, { message: 'Bad status.' });

		try {
			if (status === '-') {
				await pb.collection('attendance').delete(id);
			} else if (id) {
				await pb.collection('attendance').update(id, { present: status === 'Present' });
			} else {
				await pb.collection('attendance').create({
					user: locals.user.id,
					date: day,
					present: status === 'Present'
				});
			}
		} catch {
			return fail(500, { message: 'Could not save that change.' });
		}
	},

	de: async ({ request, locals }) => {
		// Delete extra

		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { message: 'Bad ID.' });

		try {
			await locals.pb.collection('extra').delete(id);
		} catch {
			return fail(500, { message: 'Could not delete that record.' });
		}
	},

	dl: async ({ request, locals }) => {
		// Delete leave

		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { message: 'Bad ID.' });

		try {
			await locals.pb.collection('leave').delete(id);
		} catch {
			return fail(500, { message: 'Could not delete that record.' });
		}
	},

	br: async ({ request, locals }) => {
		// Bug report

		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const report = String((await request.formData()).get('report') ?? '').trim();
		if (!report) return fail(400, { message: 'Please describe the bug.' });
		if (report.length > 20000) return fail(400, { message: 'Please keep the report under 20,000 characters.' });

		try {
			await locals.pb.collection('bugs').create({ user: locals.user.id, report });
		} catch {
			return fail(500, { message: 'Failed. Please try again.' });
		}
	},

	fb: async ({ request, locals }) => {
		// Feedback

		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const form = await request.formData();
		const stars = String(form.get('stars') ?? '0');
		const feedback = String(form.get('feedback') ?? '').trim();

		if (!['0', '1', '2', '3', '4', '5'].includes(stars)) {
			return fail(400, { message: 'Invalid rating' });
		}
		if (stars === '0' && !feedback) {
			return fail(400, { message: 'Please leave a rating or a comment.' });
		}
		if (feedback.length > 20000) return fail(400, { message: 'Too lengthy 🙄. Please use the bug report form if you want to submit a stack trace.' });

		try {
			await locals.pb.collection('feedback').create({ user: locals.user.id, stars, feedback });
		} catch {
			return fail(500, { message: 'Failed. Please try again.' });
		}
	}
};
