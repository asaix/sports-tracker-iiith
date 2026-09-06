<script>
	import { deserialize } from '$app/forms';
	import bugUrl from '$lib/assets/bug-solid-full.svg';
	import calendarUrl from '$lib/assets/calendar-days-solid-full.svg';
	import githubUrl from '$lib/assets/github-brands-solid-full.svg';
	import starUrl from '$lib/assets/star-solid-full.svg';
	import virusUrl from '$lib/assets/viruses-solid-full.svg';
	import rankingUrl from '$lib/assets/ranking-star-solid-full.svg';
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';
	import AttendanceLog from '$lib/components/AttendanceLog.svelte';
	import DayMark from '$lib/components/DayMark.svelte';
	import ExtraLog from '$lib/components/ExtraLog.svelte';
	import LeaveLog from '$lib/components/LeaveLog.svelte';
	import ResponseBtn from '$lib/components/ResponseBtn.svelte';
	import VEBtn from '$lib/components/VEBtn.svelte';
	import { invalidateAll } from '$app/navigation';


	let { data } = $props();

	const today = new Date();
	const yesterday = new Date(Date.now() - 864e5);


	let attendanceOpen = $state(false);

	let attendanceLogError = $state('');

	async function handleAttendanceChange(entry, status) {
		const body = new FormData();
		body.set('day', entry.day);
		body.set('status', status);
		body.set('id', entry.id ?? '');

		const res = await fetch('?/ma', { method: 'POST', body });	
		const result = deserialize(await res.text());

		if (result.type === 'success'){
			attendanceLogError =  '';
			await invalidateAll();
		}
		else attendanceLogError = result.data?.message ?? 'Something went wrong.';

	}

	let extraOpen = $state(false);
	let leavesOpen = $state(false);

	// dummy data — replace with real records later
	let extraLog = $state([
		{ days: 5, reason: 'Inter-college football tournament' },
		{ days: 2, reason: 'Athletics meet volunteering' },
		{ days: 1, reason: 'Yoga day' }
	]);

	let leaveLog = $state([
		{ days: 3, reason: 'Fever' },
		{ days: 1, reason: 'Family function' }
	]);

	function removeFrom(list, entry) {
		const i = list.indexOf(entry);
		if (i !== -1) list.splice(i, 1);
	}

	// placeholder data — swap for real records once the sessions collection exists
	const sports = [
		{ name: 'Football', standard: 10, extra: 2, leaves: 0, requirement: 15 },
		{ name: 'Basketball', standard: 6, extra: 0, leaves: 1, requirement: 14 },
		{ name: 'Badminton', standard: 18, extra: 1, leaves: 1, requirement: 20 },
		{ name: 'Table Tennis', standard: 4, extra: 0, leaves: 0, requirement: 12 }
	];

</script>

<svelte:head><title>Home</title></svelte:head>

<main class="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
	<div class="grid grid-cols-2 gap-4">
		<DayMark date={today} />
		<DayMark isToday={false} date={yesterday} />
	</div>

	<AttendanceLog
		bind:open={attendanceOpen}
		entries={data.attendanceLog}
		errormsg = {attendanceLogError}
		onchange={handleAttendanceChange}
	/>
	<ExtraLog
		bind:open={extraOpen}
		entries={extraLog}
		ondelete={(entry) => removeFrom(extraLog, entry)}
	/>
	<LeaveLog
		bind:open={leavesOpen}
		entries={leaveLog}
		ondelete={(entry) => removeFrom(leaveLog, entry)}
	/>

	<div class="grid grid-cols-3 gap-4">
		<VEBtn icon={calendarUrl} text="Attendance" onclick={() => (attendanceOpen = true)} />
		<VEBtn icon={rankingUrl} text="Extra" onclick={() => (extraOpen = true)} />
		<VEBtn icon={virusUrl} text="Leaves" onclick={() => (leavesOpen = true)} />
	</div>

	{#each sports as { name, ...counts } (name)}
		<div>
			<AttendanceBar {...counts} />
		</div>
	{/each}

	<div class="grid grid-cols-3 gap-4">
		<ResponseBtn icon={bugUrl} text="Bug report" onclick={() => console.log('bug')} />
		<ResponseBtn icon={githubUrl} text="Contribute" onclick={() => console.log('contribute')} />
		<ResponseBtn icon={starUrl} text="Feedback" onclick={() => console.log('feedback')} />
	</div>
</main>
