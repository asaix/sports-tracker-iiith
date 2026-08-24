<script>
	import checkIcon from '$lib/assets/check-solid-full.svg?raw';
	import xmarkIcon from '$lib/assets/xmark-solid-full.svg?raw';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils.js';

	let {
		isToday = true,
		date = new Date(),
		onmark,
		onskip,
		class: className,
		...restProps
	} = $props();

	// Convert date to "Day, DD Mon"
	const formatted = $derived.by(() => {
		const d = date instanceof Date ? date : new Date(date);
		const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
		const dayMonth = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
		return `${weekday}, ${dayMonth}`;
	});
</script>

<Card.Root class={cn(className)} {...restProps}>
	<Card.Content class="flex flex-col items-center gap-3">
		<p class="text-sm font-medium">
			{isToday ? 'Today' : 'Yesterday'}
			<span class="text-muted-foreground">({formatted})</span>
		</p>

		<div class="mt-5 flex gap-5">
			<Button
				variant="outline"
				size="icon"
				class="fill-current cursor-pointer"
				aria-label="Mark attended"
				onclick={onmark}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html checkIcon}
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="fill-current cursor-pointer"
				aria-label="Mark missed"
				onclick={onskip}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html xmarkIcon}
			</Button>
		</div>
	</Card.Content>
</Card.Root>
