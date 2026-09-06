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
		onunmark,
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
			'cursor-pointer rounded-md fill-current text-white shadow-2xs transition-all duration-200 hover:scale-105',
			selected && `scale-105 ring-2 ring-offset-2 ring-offset-card ${ring}`,
			chosen && !selected && 'opacity-30 saturate-50 hover:opacity-70'
		);

	// Clicking the highlighted button clears the day instead of re-sending the
	// same status. Without an `onunmark` handler it is simply a no-op.
	const press = (mine, mark) => () => (status === mine ? onunmark?.() : mark?.());
</script>

<Card.Root
	class={cn('shadow-sm ring-0 transition-colors hover:bg-muted/50 hover:shadow-md', className)}
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
					'bg-color-4 hover:bg-color-4/90',
					markClass(status === 'Present', 'ring-color-4')
				)}
				aria-label="Mark attended"
				aria-pressed={status === 'Present'}
				onclick={press('Present', onpresent)}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html checkIcon}
			</Button>
			<Button
				size="icon"
				class={cn('bg-color-3 hover:bg-color-3/90', markClass(status === 'Absent', 'ring-color-3'))}
				aria-label="Mark missed"
				aria-pressed={status === 'Absent'}
				onclick={press('Absent', onabsent)}
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html xmarkIcon}
			</Button>
		</div>
	</Card.Content>
</Card.Root>
