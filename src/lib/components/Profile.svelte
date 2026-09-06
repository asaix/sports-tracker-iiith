<script>
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { username = '', class: className = 'absolute top-4 right-4' } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer {className}">
		<Avatar.Root class="size-9" title={username}>
			<Avatar.Fallback class="bg-card text-xs font-medium text-muted-foreground">
				{username.slice(0, 2).toUpperCase()}
			</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="min-w-40">
		<DropdownMenu.Label class="text-muted-foreground">{username}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<form method="POST" action="?/logout">
			<DropdownMenu.Item variant="destructive" class="w-full cursor-pointer">
				{#snippet child({ props })}
					<button type="submit" {...props}>Log out</button>
				{/snippet}
			</DropdownMenu.Item>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
