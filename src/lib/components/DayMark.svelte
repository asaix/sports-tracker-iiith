<script>
	import checkIcon from '$lib/assets/check-solid-full.svg?raw';
	import xmarkIcon from '$lib/assets/xmark-solid-full.svg?raw';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils.js';

	let {
		isToday = true,
		date = new Date(),
		onpresent,
		onabsent,
		class: className,
		...restProps
	} = $props();

	// Convert date to the weekday, e.g. "Mon"
	const formatted = $derived.by(() => {
		const d = date instanceof Date ? date : new Date(date);
		return d.toLocaleDateString('en-GB', { weekday: 'short' });
	});
</script>

<Card.Root
	class={cn('shadow-sm transition-colors hover:bg-muted/50 hover:shadow-md', className)}
	{...restProps}
>
	<Card.Content class="flex flex-col items-center gap-3">
		<p class="text-sm font-semibold">
			{isToday ? 'Today' : 'Yesterday'}
			<span class="text-muted-foreground">({formatted})</span>
		</p>

		<div class="mt-5 flex gap-5">
			<Button
				size="icon"
				class="cursor-pointer bg-[#3A7D44] fill-current text-white shadow-2xs transition-transform duration-200 hover:scale-105 hover:bg-[#306738]"
				aria-label="Mark attended"
				onclick={onpresent}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html checkIcon}
			</Button>
			<Button
				size="icon"
				class="cursor-pointer bg-[#D1495B] fill-current text-white shadow-2xs transition-transform duration-200 hover:scale-105 hover:bg-[#AB3C4B]"
				aria-label="Mark missed"
				onclick={onabsent}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html xmarkIcon}
			</Button>
		</div>
	</Card.Content>
</Card.Root>
