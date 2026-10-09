<script>
	import AttendanceSlider from '$lib/components/AttendanceSlider.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { cn } from '$lib/utils.js';

	let {
		open = $bindable(false),
		title = 'Past Attendance',
		description = 'View and update your records here.',
		entries = [],
		onchange
	} = $props();

	// slider value <-> status sent to the server ('-' clears the day)
	const STATUSES = ['Absent', '-', 'Present'];
	const toPos = (status) => (status === 'Absent' ? -1 : status === 'Present' ? 1 : 0);

	const asDate = (date) => (date instanceof Date ? date : new Date(date));
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>

		<div class="max-h-[60vh] scrollbar-none overflow-y-auto [&::-webkit-scrollbar]:hidden">
			<Table.Root>
				<Table.Header class="sticky top-0 z-10 bg-dialog">
					<Table.Row>
						<Table.Head class="text-center">Day</Table.Head>
						<Table.Head class="text-center">Date</Table.Head>
						<Table.Head class="text-center">Absent / Present</Table.Head>
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
								<div
									inert={entry.pending}
									class={cn(
										'flex justify-center transition-opacity',
										entry.pending && 'opacity-50'
									)}
								>
									<AttendanceSlider
										value={toPos(entry.status)}
										label="Attendance on {asDate(entry.date).toLocaleDateString('en-GB')}"
										onchange={(pos) => onchange?.(entry, STATUSES[pos + 1])}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
