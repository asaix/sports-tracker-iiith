<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let {
		open = $bindable(false),
		title = 'Report a bug',
		description = 'Please describe what went wrong. Be as descriptive as you like (more is better).',
		errormsg = '',
		onsubmit
	} = $props();

	let report = $state('');

	// onsubmit should resolve truthy on success; the text is kept on failure so
	// a long report isn't lost to a network error
	async function submit() {
		const text = report.trim();
		if (!text) return;

		if (await onsubmit?.(text)) {
			report = '';
			open = false;
		}
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

		<Textarea
			bind:value={report}
			rows={6}
			placeholder="What went wrong?"
			class="max-h-[40vh] overflow-y-auto"
		/>

		<Dialog.Footer>
			<Button class="cursor-pointer" disabled={!report.trim()} onclick={submit}>Send</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
