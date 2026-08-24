<script>
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';

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
	{#each sports as { name, ...counts } (name)}
		<div>
			<AttendanceBar {...counts} />
		</div>
	{/each}
</main>
