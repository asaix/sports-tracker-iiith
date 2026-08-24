<script>
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';
	import DayMark from '$lib/components/DayMark.svelte';

	const today = new Date();
	const yesterday = new Date(Date.now() - 864e5);

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

	{#each sports as { name, ...counts } (name)}
		<div>
			<AttendanceBar {...counts} />
		</div>
	{/each}
</main>
