<script>
	import { deserialize } from '$app/forms';
	import bugUrl from '$lib/assets/bug-solid-full.svg';
	import calendarUrl from '$lib/assets/calendar-days-solid-full.svg';
	import githubUrl from '$lib/assets/github-brands-solid-full.svg';
	import starUrl from '$lib/assets/star-solid-full.svg';
	import virusUrl from '$lib/assets/viruses-solid-full.svg';
	import rankingUrl from '$lib/assets/ranking-star-solid-full.svg';
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';
	import CreditFooter from '$lib/components/CreditFooter.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import AttendanceLog from '$lib/components/AttendanceLog.svelte';
	import BugReport from '$lib/components/BugReport.svelte';
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';
	import DayMark from '$lib/components/DayMark.svelte';
	import ExtraLog from '$lib/components/ExtraLog.svelte';
	import LeaveLog from '$lib/components/LeaveLog.svelte';
	import LoginPrompt from '$lib/components/LoginPrompt.svelte';
	import ResponseBtn from '$lib/components/ResponseBtn.svelte';
	import VEBtn from '$lib/components/VEBtn.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let attendanceOpen = $state(false);

	let loginOpen = $state(false);
	// set 10s timer to show login popout if unauthenticated
	$effect(() => {
		if (!data.demo) return;
		const timer = setTimeout(() => (loginOpen = true), 10_000);
		return () => clearTimeout(timer);
	});

	// block clicks if demo
	function gateDemo(event) {
		if (!data.demo) return;
		event.preventDefault();
		event.stopPropagation();
		loginOpen = true;
	}

	let errors = $state({ attendance: '', extra: '', leave: '', bug: '', feedback: '' });

	const extraTotal = $derived(data.extra.reduce((sum, e) => sum + e.count, 0));
	const leaveTotal = $derived(data.leave.reduce((sum, e) => sum + e.count, 0));

	async function callAction(action, fields, errorKey) {
		const body = new FormData();
		for (const [key, value] of Object.entries(fields)) body.set(key, value);

		const res = await fetch(`?/${action}`, { method: 'POST', body });
		const result = deserialize(await res.text());

		if (result.type === 'success') {
			errors[errorKey] = '';
			await invalidateAll();
			return true;
		}

		errors[errorKey] = result.data?.message ?? 'Something went wrong.';
		return false;
	}

	function handleAttendanceChange(entry, status) {
		return callAction('ma', { day: entry.day, status, id: entry.id ?? '' }, 'attendance');
	}

	let bugOpen = $state(false);
	let feedbackOpen = $state(false);
	let extraOpen = $state(false);
	let leavesOpen = $state(false);
</script>

<svelte:head><title>Home</title></svelte:head>

<main
	class="relative mx-auto flex min-h-svh w-full max-w-lg flex-col gap-4 p-4 pt-20"
	onclickcapture={gateDemo}
>
	{#if data.demo}
		<p class="absolute top-5 right-4 rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">
			Demo
		</p>
	{:else}
		<Profile username={data.username} />
	{/if}
	<LoginPrompt open={loginOpen} />

	<AttendanceBar
		standard={data.standard}
		requirement={data.requirement}
		extra={extraTotal}
		leaves={leaveTotal}
	/>
	<div class="grid grid-cols-2 gap-4">
		<DayMark
			date={data.attendanceLog[0].date}
			onpresent={() => handleAttendanceChange(data.attendanceLog[0], 'Present')}
			onabsent={() => handleAttendanceChange(data.attendanceLog[0], 'Absent')}
			onunmark={() => handleAttendanceChange(data.attendanceLog[0], '-')}
			status={data.attendanceLog[0].status}
		/>
		<DayMark
			date={data.attendanceLog[1].date}
			onpresent={() => handleAttendanceChange(data.attendanceLog[1], 'Present')}
			onabsent={() => handleAttendanceChange(data.attendanceLog[1], 'Absent')}
			onunmark={() => handleAttendanceChange(data.attendanceLog[1], '-')}
			isToday={false}
			status={data.attendanceLog[1].status}
		/>
	</div>

	<AttendanceLog
		bind:open={attendanceOpen}
		entries={data.attendanceLog}
		errormsg={errors.attendance}
		onchange={handleAttendanceChange}
	/>
	<ExtraLog
		bind:open={extraOpen}
		entries={data.extra}
		errormsg={errors.extra}
		ondelete={(entry) => callAction('de', { id: entry.id }, 'extra')}
		onadd={(fields) => callAction('ae', fields, 'extra')}
	/>
	<LeaveLog
		bind:open={leavesOpen}
		entries={data.leave}
		errormsg={errors.leave}
		ondelete={(entry) => callAction('dl', { id: entry.id }, 'leave')}
		onadd={(fields) => callAction('al', fields, 'leave')}
	/>
	<BugReport
		bind:open={bugOpen}
		errormsg={errors.bug}
		onsubmit={(report) => callAction('br', { report }, 'bug')}
	/>
	<FeedbackForm
		bind:open={feedbackOpen}
		errormsg={errors.feedback}
		onsubmit={(fields) => callAction('fb', fields, 'feedback')}
	/>

	<div class="grid grid-cols-3 gap-4">
		<VEBtn icon={calendarUrl} text="Attendance" onclick={() => (attendanceOpen = true)} />
		<VEBtn icon={rankingUrl} text="Extra" onclick={() => (extraOpen = true)} />
		<VEBtn icon={virusUrl} text="Leaves" onclick={() => (leavesOpen = true)} />
	</div>

	<div class="mx-auto my-6 h-1.5 w-15 rounded-full bg-color-2"></div>

	<div class="grid grid-cols-3 gap-4">
		<ResponseBtn
			icon={bugUrl}
			text="Bug report"
			class="bg-red-100"
			onclick={() => (bugOpen = true)}
		/>
		<ResponseBtn
			icon={githubUrl}
			text="Contribute"
			class="bg-blue-100"
			onclick={() =>
				window.open(
					'https://github.com/asaix/sports-tracker-iiith',
					'_blank',
					'noopener,noreferrer'
				)}
		/>
		<ResponseBtn
			icon={starUrl}
			text="Feedback"
			class="bg-green-100"
			onclick={() => (feedbackOpen = true)}
		/>
	</div>

	<CreditFooter
		class="mt-auto mb-0.5"
		people={[{ name: '@asaix', link: 'https://github.com/asaix' }]}
	/>
</main>
