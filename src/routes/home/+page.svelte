<script>
	import calendarUrl from '$lib/assets/calendar-days-solid-full.svg';
	import virusUrl from '$lib/assets/viruses-solid-full.svg';
	import rankingUrl from '$lib/assets/ranking-star-solid-full.svg';
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';
	import DayMark from '$lib/components/DayMark.svelte';
	import VEBtn from '$lib/components/VEBtn.svelte';

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

	<!-- popups not wired up yet -->
	<div class="grid grid-cols-3 gap-4">
		<VEBtn icon={calendarUrl} text="Attendance" onclick={() => console.log('attendance')} />
		<VEBtn icon={rankingUrl} text="Extra" onclick={() => console.log('extra')} />
		<VEBtn icon={virusUrl} text="Leaves" onclick={() => console.log('leaves')} />
	</div>

	{#each sports as { name, ...counts } (name)}
		<div>
			<AttendanceBar {...counts} />
		</div>
	{/each}
</main>
