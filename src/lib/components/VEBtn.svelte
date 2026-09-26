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
			<span
				role="img"
				aria-label={imgalt}
				aria-hidden={!imgalt}
				class="size-6 bg-color-3"
				style={`mask: url("${icon}") center / contain no-repeat; -webkit-mask: url("${icon}") center / contain no-repeat;`}
			></span>
		{/if}
		<span class="text-sm font-medium">{text}</span>
	</Card.Content>
</Card.Root>
