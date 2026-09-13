<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { form } = $props();
</script>

<svelte:head><title>Reset password</title></svelte:head>

<main class="flex min-h-svh items-center justify-center p-4">
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Reset your password</Card.Title>
			<Card.Description>Use your recovery code to recover your account.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<Label for="username">Username</Label>
					<Input id="username" name="username" autocomplete="username" required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="code">Recovery code</Label>
					<Input id="code" name="code" placeholder="XXXX-XXXX" autocomplete="off" required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="password">New password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						autocomplete="new-password"
						minlength={8}
						required
					/>
				</div>

				<Button type="submit" class="mt-2 w-full cursor-pointer">Reset password</Button>

				{#if form?.message}
					<p class="text-center text-sm font-medium text-destructive">{form.message}</p>
				{/if}

				<p class="text-center text-sm text-muted-foreground">
					 <a href={resolve('/login')} class="underline underline-offset-4">Back to login</a
					>
				</p>
			</form>
		</Card.Content>
	</Card.Root>
</main>
