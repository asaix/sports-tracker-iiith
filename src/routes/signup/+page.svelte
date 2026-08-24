<script>
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { genders, signupSchema } from './schema.js';

	let { data } = $props();

	const form = superForm(data.form, { validators: zod4Client(signupSchema) });
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
			</form>
		</Card.Content>
	</Card.Root>
</main>
