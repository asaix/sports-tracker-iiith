<script>
	import './layout.css';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	let { children } = $props();

	const STALE_AFTER = 30_000;
	let lastRefresh = Date.now();

	function refresh(force = false) {
		// only run on /
		if (page.route.id !== '/') return;
		if (!force && Date.now() - lastRefresh < STALE_AFTER) return;
		lastRefresh = Date.now();
		invalidateAll();
	}

	$effect(() => {
		let id;
		const scheduleMidnight = () => {
			const now = new Date();
			const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
			id = setTimeout(() => {
				refresh(true);
				scheduleMidnight();
			}, next - Date.now());
		};
		scheduleMidnight();
		return () => clearTimeout(id);
	});
</script>

<svelte:document onvisibilitychange={() => document.visibilityState === 'visible' && refresh()} />
<svelte:window ononline={() => refresh(true)} />

<!-- 

refresh data on:
- back online [force]
- midnight rollover [force]
- on tab refocus [if > 30s since last refresh]

-->


{@render children()}
