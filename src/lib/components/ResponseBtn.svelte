<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils.js';

	let { icon, text, imgalt = '', onclick, class: className, ...restProps } = $props();
</script>

<Card.Root
	{onclick}
	class={cn('cursor-pointer justify-center rounded-md bg-card py-4 ring-1', className)}
	{...restProps}
>
	<Card.Content class="flex flex-col items-center justify-center gap-2 px-4 text-center">
		{#if icon}
			<span
				role="img"
				aria-label={imgalt}
				aria-hidden={!imgalt}
				class="size-6 bg-color-3"
				style={`mask: url("${icon}") center / contain no-repeat; -webkit-mask: url("${icon}") center / contain no-repeat;`}
			></span>
		{/if}
		{text}
	</Card.Content>
</Card.Root>
