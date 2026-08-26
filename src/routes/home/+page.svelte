<script>
	import bugUrl from '$lib/assets/bug-solid-full.svg';
	import calendarUrl from '$lib/assets/calendar-days-solid-full.svg';
	import githubUrl from '$lib/assets/github-brands-solid-full.svg';
	import starUrl from '$lib/assets/star-solid-full.svg';
	import virusUrl from '$lib/assets/viruses-solid-full.svg';
	import rankingUrl from '$lib/assets/ranking-star-solid-full.svg';
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';
	import AttendanceLog from '$lib/components/AttendanceLog.svelte';
	import DayMark from '$lib/components/DayMark.svelte';
	import ResponseBtn from '$lib/components/ResponseBtn.svelte';
	import VEBtn from '$lib/components/VEBtn.svelte';

	const today = new Date();
	const yesterday = new Date(Date.now() - 864e5);

	let attendanceOpen = $state(false);

	// imaginary data — the last 7 days, newest first
	let attendanceLog = $state(
		['Present', 'Absent', 'Present', '-', 'Present', 'Present', 'Absent'].map((status, i) => ({
			date: new Date(Date.now() - i * 864e5),
			status
		}))
	);

	function handleAttendanceChange(entry, status) {
		// bind: has already written entry.status — this is purely the side-effect hook
		console.log('attendance changed:', entry.date.toDateString(), '→', status);
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
		entries={attendanceLog}
		onchange={handleAttendanceChange}
	/>

	<div class="grid grid-cols-3 gap-4">
		<VEBtn icon={calendarUrl} text="Attendance" onclick={() => (attendanceOpen = true)} />
		<VEBtn icon={rankingUrl} text="Extra" onclick={() => console.log('extra')} />
		<VEBtn icon={virusUrl} text="Leaves" onclick={() => console.log('leaves')} />
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
