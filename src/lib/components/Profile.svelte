<script>
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { username = '', class: className = 'absolute top-4 right-4' } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="group flex cursor-pointer items-center gap-1 rounded-md py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-focus/70 {className}"
	>
		<span class="font-medium tracking-tight">
			<span class="text-muted-foreground">@</span>{username}
		</span>
		<HugeiconsIcon
			icon={ArrowDown01Icon}
			size={14}
			strokeWidth={2}
			class="ml-0.5 text-muted-foreground transition-transform duration-100 group-data-[state=open]:rotate-180"
		/>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="min-w-40">
		<DropdownMenu.Label class="text-muted-foreground">{username}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<form method="POST" action="?/logout">
			<DropdownMenu.Item
				class="w-full cursor-pointer text-danger focus:bg-danger/10 focus:text-danger"
			>
				{#snippet child({ props })}
					<button type="submit" {...props}>Log out</button>
				{/snippet}
			</DropdownMenu.Item>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
