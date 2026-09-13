<script>
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { genders, signupSchema } from '$lib/schemas.js';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();

	let recoveryCode = $state('');
	let copied = $state(false);

	const form = superForm(data.form, {
		validators: zod4Client(signupSchema),
		invalidateAll: false,
		onResult({ result }) {
			if (result.type === 'success' && result.data?.recoveryCode) {
				recoveryCode = result.data.recoveryCode;
			}
		}
	});

	async function copy() {
		await navigator.clipboard.writeText(recoveryCode);
		copied = true;
	}
	const { form: formData, message, enhance } = form;

	const selectClasses =
		'h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm';
</script>

<svelte:head><title>Sign up</title></svelte:head>

<main class="flex min-h-svh items-center justify-center p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Create an account</Card.Title>
			<Card.Description
				>This information is used to uniquely identify you and is not shared publicly.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} bind:value={$formData.username} autocomplete="username" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								{...props}
								type="password"
								bind:value={$formData.password}
								autocomplete="new-password"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="gender">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Gender</Form.Label>
							<select {...props} bind:value={$formData.gender} class={selectClasses}>
								<option value="" disabled>Select…</option>
								{#each genders as { value, label } (value)}
									<option {value}>{label}</option>
								{/each}
							</select>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="mt-2 w-full">Sign up</Form.Button>

				{#if $message}
					<p class="text-center text-sm font-medium text-destructive">{$message}</p>
				{/if}

				<p class="text-center text-sm text-muted-foreground">
					Have an account? <a href={resolve('/login')} class="underline underline-offset-4"
						>Sign in here</a
					>
				</p>
			</form>
		</Card.Content>
	</Card.Root>
</main>

<AlertDialog.Root open={!!recoveryCode}>
	<AlertDialog.Content escapeKeydownBehavior="ignore">
		<AlertDialog.Header>
			<AlertDialog.Title>Save your recovery code</AlertDialog.Title>
			<AlertDialog.Description>
				If you forget your password, you'll need this code to reset it. Copy it and keep it
				somewhere safe. It won't be shown again.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<p class="rounded-xl bg-muted py-4 text-center font-mono text-2xl tracking-widest">
			{recoveryCode}
		</p>
		<AlertDialog.Footer>
			<Button variant="outline" class="cursor-pointer" onclick={copy}>
				{copied ? 'Copied' : 'Copy'}
			</Button>
			<Button class="cursor-pointer" onclick={() => goto(resolve('/'))}>Continue</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
