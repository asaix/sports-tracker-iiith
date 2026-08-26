<script>
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { cn } from '$lib/utils.js';

	let {
		open = $bindable(false),
		title = 'Past Attendance',
		description = 'View and update your records here.',
		entries = [],
		onchange
	} = $props();

	const statuses = ['-', 'Present', 'Absent'];

	const asDate = (date) => (date instanceof Date ? date : new Date(date));
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Day</Table.Head>
					<Table.Head>Date</Table.Head>
					<Table.Head>Present/Absent</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each entries as entry (entry)}
					<Table.Row>
						<Table.Cell class="font-medium">
							{asDate(entry.date).toLocaleDateString('en-GB', { weekday: 'short' })}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">
							{asDate(entry.date).toLocaleDateString('en-GB', {
								day: '2-digit',
								month: '2-digit'
							})}
						</Table.Cell>
						<Table.Cell>
							<Select.Root
								type="single"
								value={entry.status}
								onValueChange={(value) => onchange?.(entry, value)}
							>
								<Select.Trigger
									class={cn(
										'w-32',
										'focus-visible:ring-0',
										entry.status === 'Present' &&
											'border-transparent bg-[#3A7D44] text-white [&_svg]:text-white',
										entry.status === 'Absent' &&
											'border-transparent bg-[#D1495B] text-white [&_svg]:text-white'
									)}
								>
									{entry.status}
								</Select.Trigger>
								<Select.Content>
									{#each statuses as status (status)}
										<Select.Item value={status} label={status}>{status}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Dialog.Content>
</Dialog.Root>
