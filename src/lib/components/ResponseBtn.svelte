<script>
	let { icon, text, imgalt = '', onclick, class: className = 'bg-card' } = $props();
</script>

<button
	type="button"
	{onclick}
	class="flex cursor-pointer flex-col items-center gap-2 rounded-md px-4 py-3 text-sm {className}"
>
	{#if icon}
		<span
			role="img"
			aria-label={imgalt}
			aria-hidden={!imgalt}
			class="size-6 bg-color-3"
			style={`mask: url("${icon}") center / contain no-repeat; -webkit-mask: url("${icon}") center / contain no-repeat;`}
		></span>
	{/if}
	{text}
</button>
