<script>
	import minusIcon from '$lib/assets/circle-minus-solid-full.svg?raw';
	import plusIcon from '$lib/assets/circle-plus-solid-full.svg?raw';
	import xmarkIcon from '$lib/assets/xmark-solid-full.svg?raw';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Item from '$lib/components/ui/item/index.js';

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
	let reasonInput = $state(null);

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
	<Dialog.Content
		class="sm:max-w-lg"
		onOpenAutoFocus={(e) => {
			// bits-ui ignores `autofocus` and would focus the first delete button
			e.preventDefault();
			requestAnimationFrame(() => reasonInput?.focus());
		}}
	>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
			{#if errormsg}
				<p class="text-sm font-medium text-destructive" role="alert">{errormsg}</p>
			{/if}
		</Dialog.Header>

		<Item.Group
			class="max-h-[50vh] scrollbar-none gap-0 overflow-y-auto rounded-2xl bg-entry ring-1 ring-foreground/5 has-data-[size=sm]:gap-0 [&::-webkit-scrollbar]:hidden"
		>
			{#each entries as entry, i (entry.id)}
				{#if i > 0}
					<Item.Separator class="my-0 bg-foreground/5" />
				{/if}
				<Item.Root size="sm" class="rounded-none">
					<Item.Media
						class="size-8 rounded-full text-sm font-semibold text-leave tabular-nums ring-1 ring-leave/50"
					>
						{entry.count}
					</Item.Media>
					<Item.Content class="min-w-0 basis-0 items-center text-center">
						<Item.Title class="line-clamp-none wrap-anywhere">{entry.reason}</Item.Title>
					</Item.Content>
					<Item.Actions>
						<Button
							variant="ghost"
							size="icon-sm"
							class="cursor-pointer fill-muted-foreground hover:fill-icon-hover"
							aria-label="Delete entry"
							onclick={() => (pending = entry)}
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
							{@html xmarkIcon}
						</Button>
					</Item.Actions>
				</Item.Root>
			{:else}
				<p class="py-6 text-center text-sm text-muted-foreground">No leaves recorded yet.</p>
			{/each}
		</Item.Group>

		<form
			class="flex gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				add();
			}}
		>
			<div class="flex shrink-0 items-center rounded-4xl border border-input bg-input/30">
				<Button
					variant="ghost"
					size="icon-sm"
					class="cursor-pointer fill-current text-minus hover:text-minus [&_svg]:size-5"
					aria-label="Fewer days"
					disabled={count <= 1}
					onclick={() => (count = Math.max(1, count - 1))}
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
					{@html minusIcon}
				</Button>
				<span class="w-6 text-center text-sm tabular-nums" aria-live="polite">{count}</span>
				<Button
					variant="ghost"
					size="icon-sm"
					class="cursor-pointer fill-current text-plus hover:text-plus [&_svg]:size-5"
					aria-label="More days"
					onclick={() => count++}
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
					{@html plusIcon}
				</Button>
			</div>
			<Input
				class="focus-visible:border-input focus-visible:ring-0"
				bind:ref={reasonInput}
				bind:value={reason}
				placeholder="Reason"
			/>
			<Button type="submit" class="cursor-pointer" disabled={!reason.trim()}>Add</Button>
		</form>
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
			<AlertDialog.Description class="wrap-anywhere">
				This will permanently remove “{pending?.reason}” ({pending?.count}
				{pending?.count === 1 ? 'day' : 'days'}). This cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class="cursor-pointer">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="cursor-pointer bg-confirm text-confirm-foreground"
				onclick={confirmDelete}
			>
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
