<!-- View/Edit Button -->

<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils.js';

	let { icon, text, imgalt = '', onclick, class: className, ...restProps } = $props();
</script>

<Card.Root
	{onclick}
	class={cn(
		'h-full cursor-pointer shadow-sm ring-0 transition-all hover:bg-muted/50 hover:shadow-md',
		className
	)}
	{...restProps}
>
	<Card.Content class="flex flex-col items-center gap-2 text-center">
		{#if icon}
			<img src={icon} alt={imgalt} class="size-6" />
		{/if}
		<span class="text-sm font-medium">{text}</span>
	</Card.Content>
</Card.Root>
