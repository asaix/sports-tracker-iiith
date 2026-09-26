<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { cn } from '$lib/utils.js';

	let {
		standard = 0,
		requirement = 0,
		extra = 0,
		leaves = 0,
		class: className,
		...restProps
	} = $props();

	const total = $derived(standard + extra + leaves);
</script>

<Card.Root
	class={cn('w-full rounded-lg mb-2 mt-2 ring-0 bg-background', className)}
	{...restProps}
>
	<Card.Content class="flex flex-col gap-3">
		<p class="text-xl font-medium">{total} / {requirement} done so far</p>

		<Progress value={total} max={Math.max(requirement, 1)} />

		<p class="text-xs text-muted-foreground">
			(standard + extra + leaves) = ({standard} + {extra} + {leaves}) = {total}
		</p>
	</Card.Content>
</Card.Root>
