<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let { icon, text, imgalt = '', onclick, class: className, ...restProps } = $props();
</script>

<Button
	variant="secondary"
	{onclick}
	class={cn(
		'h-auto cursor-pointer flex-col gap-2 rounded-full px-5 py-4 shadow-xs border border-gray-200 hover:shadow-sm',
		className
	)}
	{...restProps}
>
	{#if icon}
		<img src={icon} alt={imgalt} class="size-6" />
	{/if}
	<span class="text-sm font-medium">{text}</span>
</Button>
