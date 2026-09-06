<script>
	import starIcon from '$lib/assets/star-solid-full.svg?raw';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils.js';

	let {
		open = $bindable(false),
		title = 'Leave feedback',
		description = 'How are you finding the app?',
		errormsg = '',
		onsubmit
	} = $props();

	let stars = $state(0);
	let feedback = $state('');

	// onsubmit should resolve truthy on success; input is kept on failure
	async function submit() {
		const text = feedback.trim();
		if (!stars && !text) return;

		if (await onsubmit?.({ stars: String(stars), feedback: text })) {
			stars = 0;
			feedback = '';
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

		<div class="flex gap-1">
			{#each [1, 2, 3, 4, 5] as star (star)}
				<button
					type="button"
					class={cn(
						'cursor-pointer fill-current [&_svg]:size-12',
						star <= stars ? 'text-amber-400' : 'text-gray-300'
					)}
					aria-label="{star} star{star === 1 ? '' : 's'}"
					aria-pressed={star === stars}
					onclick={() => (stars = star === stars ? 0 : star)}
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
					{@html starIcon}
				</button>
			{/each}
		</div>

		<Textarea
			bind:value={feedback}
			rows={6}
			placeholder="Anything else you'd like to tell us?"
			class="max-h-[40vh] overflow-y-auto"
		/>

		<Dialog.Footer>
			<Button class="cursor-pointer" disabled={!stars && !feedback.trim()} onclick={submit}>
				Send
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
