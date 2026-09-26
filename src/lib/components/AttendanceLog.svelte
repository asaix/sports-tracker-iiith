<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { cn } from '$lib/utils.js';

	let {
		open = $bindable(false),
		title = 'Past Attendance',
		description = 'View and update your records here.',
		entries = [],
		onchange,
		errormsg = ''
	} = $props();

	// value sent to the server, letter shown on the button, colour when selected.
	// Clicking the already-selected one sends '-', which clears the day.
	const statuses = [
		{ value: 'Present', label: 'P', selected: 'bg-color-5 text-color-1 hover:bg-color-5/90' },
		{ value: 'Absent', label: 'A', selected: 'bg-color-6 text-color-1 hover:bg-color-6/90' }
	];

	const asDate = (date) => (date instanceof Date ? date : new Date(date));
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
			{#if errormsg}
				<p class="text-sm font-medium text-destructive" role="alert">{errormsg}</p>
			{/if}
		</Dialog.Header>

		<div class="max-h-[60vh] scrollbar-none overflow-y-auto [&::-webkit-scrollbar]:hidden">
			<Table.Root>
				<Table.Header class="sticky top-0 z-10 bg-popover">
					<Table.Row>
						<Table.Head class="text-center">Day</Table.Head>
						<Table.Head class="text-center">Date</Table.Head>
						<Table.Head class="text-center">Present/Absent</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each entries as entry (entry.day)}
						<Table.Row>
							<Table.Cell class="text-center font-medium">
								{asDate(entry.date).toLocaleDateString('en-GB', { weekday: 'short' })}
							</Table.Cell>
							<Table.Cell class="text-center text-muted-foreground">
								{asDate(entry.date).toLocaleDateString('en-GB', {
									day: '2-digit',
									month: '2-digit'
								})}
							</Table.Cell>
							<Table.Cell>
								<div class="flex justify-center gap-3">
									{#each statuses as { value, label, selected } (value)}
										<Button
											size="icon-sm"
											class={cn(
												'cursor-pointer rounded-full',
												entry.status === value ? selected : 'bg-muted text-muted-foreground'
											)}
											aria-label={value}
											aria-pressed={entry.status === value}
											onclick={() => onchange?.(entry, entry.status === value ? '-' : value)}
										>
											{label}
										</Button>
									{/each}
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
