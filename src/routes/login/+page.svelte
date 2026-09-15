<script>
	import { resolve } from '$app/paths';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { loginSchema } from '$lib/schemas.js';

	let { data } = $props();

	const form = superForm(data.form, { validators: zod4Client(loginSchema) });
	const { form: formData, message, enhance } = form;
</script>

<svelte:head><title>Sign In | IIIT-H Sports Tracker</title></svelte:head>

<main class="flex min-h-svh items-center justify-center p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Sign into your account</Card.Title>
			<Card.Description>Welcome back!</Card.Description>
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
								autocomplete="current-password"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="mt-2 w-full">Sign in</Form.Button>

				{#if $message}
					<p class="text-center text-sm font-medium text-destructive">{$message}</p>
				{/if}

				<p class="text-center text-sm text-muted-foreground">
					No account? <a href={resolve('/signup')} class="underline underline-offset-4">Sign up</a>
				</p>
				<p class="text-center text-sm text-muted-foreground">
					<a href={resolve('/recover')} class="underline underline-offset-4">Forgot your password?</a>
				</p>
			</form>
		</Card.Content>
	</Card.Root>
</main>
