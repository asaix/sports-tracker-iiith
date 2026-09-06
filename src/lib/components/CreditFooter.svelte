<script>
	// people: [{ name, link }]
	let { people = [], class: className = '' } = $props();
</script>

<p class="text-center font-barcode text-2xl text-muted-foreground {className}">
	{#each people as person, i (person.link)}
		<a
			href={person.link}
			target="_blank"
			rel="noopener noreferrer"
			class="underline-offset-4 transition-colors hover:text-foreground hover:underline"
		>
			{person.name}
		</a>{i < people.length - 1 ? ',' : ''}
	{/each}
</p>
