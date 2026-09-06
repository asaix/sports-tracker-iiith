<script>
	import checkIcon from '$lib/assets/check-solid-full.svg?raw';
	import xmarkIcon from '$lib/assets/xmark-solid-full.svg?raw';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils.js';

	let {
		isToday = true,
		date = new Date(),
		status = '-',
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

	const chosen = $derived(status === 'Present' || status === 'Absent');

	const markClass = (selected, ring) =>
		cn(
			'cursor-pointer fill-current text-white shadow-2xs transition-all duration-200 hover:scale-105',
			selected && `scale-105 ring-2 ring-offset-2 ring-offset-card ${ring}`,
			chosen && !selected && 'opacity-30 saturate-50 hover:opacity-70'
		);
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
				class={cn(
					'bg-[#3A7D44] hover:bg-[#306738]',
					markClass(status === 'Present', 'ring-[#3A7D44]')
				)}
				aria-label="Mark attended"
				aria-pressed={status === 'Present'}
				onclick={onpresent}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html checkIcon}
			</Button>
			<Button
				size="icon"
				class={cn(
					'bg-[#D1495B] hover:bg-[#AB3C4B]',
					markClass(status === 'Absent', 'ring-[#D1495B]')
				)}
				aria-label="Mark missed"
				aria-pressed={status === 'Absent'}
				onclick={onabsent}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html xmarkIcon}
			</Button>
		</div>
	</Card.Content>
</Card.Root>
