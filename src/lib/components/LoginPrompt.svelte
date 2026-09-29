<script>
	import { resolve } from '$app/paths';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	let { open = false } = $props();
</script>

<AlertDialog.Root {open}>
	<AlertDialog.Content escapeKeydownBehavior="ignore"> <!-- Can't close -->
		<AlertDialog.Header>
			<AlertDialog.Title>Please sign in</AlertDialog.Title>
			<AlertDialog.Description>
				Please sign in or create an account to start tracking your attendance.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<a href={resolve('/signup')} class={buttonVariants()}>Sign up</a>
			<a href={resolve('/login')} class={buttonVariants({ variant: 'outline' })}>Log in</a>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
