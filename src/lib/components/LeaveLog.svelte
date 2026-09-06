<script>
	import xmarkIcon from '$lib/assets/xmark-solid-full.svg?raw';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let {
		open = $bindable(false),
		title = 'Leaves',
		description = 'Days excused from your attendance requirement.',
		entries = [],
		ondelete,
		onadd,
		errormsg = ''
	} = $props();

	let count = $state(1);
	let reason = $state('');

	// onadd should resolve truthy on success, so input is kept if the save fails
	async function add() {
		if (!reason.trim()) return;

		if (await onadd?.({ count: String(count), reason: reason.trim() })) {
			count = 1;
			reason = '';
		}
	}

	let pending = $state(null);

	function confirmDelete() {
		if (pending) ondelete?.(pending);
		pending = null;
	}
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

		<div class="flex flex-col gap-3">
			{#each entries as entry (entry)}
				<div class="flex items-center gap-4 rounded-2xl bg-muted/50 px-5 py-4">
					<span class="text-3xl font-semibold tabular-nums">{entry.count}</span>
					<span class="text-xs text-muted-foreground">|</span>
					<span class="text-sm">{entry.reason}</span>
					<Button
						variant="ghost"
						size="icon-sm"
						class="ml-auto shrink-0 cursor-pointer fill-muted-foreground hover:fill-[#D1495B]"
						aria-label="Delete entry"
						onclick={() => (pending = entry)}
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
						{@html xmarkIcon}
					</Button>
				</div>
			{:else}
				<p class="py-6 text-center text-sm text-muted-foreground">No leaves recorded yet.</p>
			{/each}
		</div>

		<div class="flex gap-2">
			<Input type="number" min="1" bind:value={count} class="w-20" aria-label="Days" />
			<Input bind:value={reason} placeholder="Reason" />
			<Button class="cursor-pointer" disabled={!reason.trim()} onclick={add}>Add</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root
	open={pending !== null}
	onOpenChange={(isOpen) => {
		if (!isOpen) pending = null;
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently remove “{pending?.reason}” ({pending?.count}
				{pending?.count === 1 ? 'day' : 'days'}). This cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class="cursor-pointer">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="cursor-pointer bg-[#D1495B] text-white hover:bg-[#AB3C4B]"
				onclick={confirmDelete}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
