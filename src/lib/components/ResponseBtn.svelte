<script>
	let { icon, text, imgalt = '', onclick, class: className = 'bg-gray-100' } = $props();
</script>

<button
	type="button"
	{onclick}
	class="flex cursor-pointer flex-col items-center gap-2 rounded-lg px-4 py-3 text-sm shadow-sm {className}"
>
	{#if icon}
		<img src={icon} alt={imgalt} class="size-6" />
	{/if}
	{text}
</button>
