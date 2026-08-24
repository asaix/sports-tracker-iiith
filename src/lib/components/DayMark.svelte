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

	// Convert date to the weekday, e.g. "Mon"
	const formatted = $derived.by(() => {
		const d = date instanceof Date ? date : new Date(date);
		return d.toLocaleDateString('en-GB', { weekday: 'short' });
	});
</script>

<Card.Root class={cn('transition-colors shadow-sm hover:shadow-md hover:bg-muted/50', className)} {...restProps}>
	<Card.Content class="flex flex-col items-center gap-3">
		<p class="text-sm font-semibold">
			{isToday ? 'Today' : 'Yesterday'}
			<span class="text-muted-foreground">({formatted})</span>
		</p>

		<div class="mt-5 flex gap-5">
			<Button
				size="icon"
				class="cursor-pointer shadow-2xs bg-[#3A7D44] transition-transform duration-200 hover:scale-105 fill-current text-white hover:bg-[#306738]"
				aria-label="Mark attended"
				onclick={onmark}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html checkIcon}
			</Button>
			<Button
				size="icon"
				class="cursor-pointer shadow-2xs bg-[#D1495B] transition-transform duration-200 hover:scale-105 fill-current text-white hover:bg-[#AB3C4B]"
				aria-label="Mark missed"
				onclick={onskip}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html xmarkIcon}
			</Button>
		</div>
	</Card.Content>
</Card.Root>
