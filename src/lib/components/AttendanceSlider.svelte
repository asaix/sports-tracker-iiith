<!-- squish animation adapted from Framer's SquishToggle: https://framer.com/m/SquishToggle-1-jPtqE7.js@0jJ6DliiL5q7rBiveuxN -->

<script>
	import checkIcon from '$lib/assets/check-solid-full.svg?raw';
	import xmarkIcon from '$lib/assets/xmark-solid-full.svg?raw';
	import { cn } from '$lib/utils.js';

	let { value = 0, onchange, label = '', class: className } = $props();

	const WIDTH = 96;
	const HEIGHT = 30;
	const PADDING = 3;
	const THUMB = HEIGHT - PADDING * 2;
	const TRAVEL = WIDTH - PADDING * 2 - THUMB;
	const HALF = TRAVEL / 2;
	const DURATION = 400;
	const EASE_IN = 'cubic-bezier(0.75, 0, 1, 1)';
	const EASE_OUT = 'cubic-bezier(0, 0, 0.3, 1.15)';
	const VALUE_TEXT = ['Absent', 'Not marked', 'Present'];

	const xOf = (v) => (v + 1) * HALF;
	const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

	let pos = $derived(value);
	let dragX = $state(null);
	let pressed = $state(false);
	let slide = $state(null);
	let body = $state(null);

	const x = $derived(dragX ?? xOf(pos));
	const lean = $derived(x / HALF - 1);
	const hintOpacity = $derived(clamp(1 - 3 * Math.abs(lean), 0, 1));
	const tint = (pct, base) =>
		`color-mix(in srgb, var(${lean < 0 ? '--absent' : '--present'}) ${Math.abs(lean) * pct}%, ${base})`;
	const trackColor = $derived(tint(14, 'var(--toggle-track)'));
	const ringColor = $derived(tint(45, 'var(--toggle-ring)'));
	const thumbColor = $derived(tint(100, 'var(--toggle-thumb)'));

	function squish(from, to) {
		const dir = Math.sign(to - from);
		if (!dir || !slide || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const mid = from + dir * Math.min(8, Math.abs(to - from) / 2);
		const timing = { duration: DURATION };
		slide.getAnimations().forEach((a) => a.cancel());
		body.getAnimations().forEach((a) => a.cancel());

		slide.animate(
			[
				{ transform: `translateX(${from}px)`, easing: EASE_IN },
				{ offset: 0.5, transform: `translateX(${mid}px)`, easing: EASE_OUT },
				{ transform: `translateX(${to}px)` }
			],
			timing
		);
		body.style.transformOrigin = dir > 0 ? 'left center' : 'right center';
		body.animate(
			[
				{ transform: 'scale(1, 1)', borderRadius: '50%', easing: EASE_IN },
				{ offset: 0.5, transform: 'scale(1.22, 0.7)', borderRadius: '70%', easing: EASE_OUT },
				{ transform: 'scale(1, 1)', borderRadius: '50%' }
			],
			timing
		);
	}

	function moveTo(next, from = xOf(pos)) {
		pos = next;
		dragX = null;
		squish(from, xOf(next));
	}

	async function commit(next, from) {
		const prev = pos;
		moveTo(next, from);
		if (next === prev) return;
		navigator.vibrate?.(10);
		if ((await onchange?.(next)) === false) moveTo(prev);
	}

	let start = null;

	function onpointerdown(e) {
		if (e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		start = { px: e.clientX, x: xOf(pos), moved: false };
		pressed = true;
	}

	function onpointermove(e) {
		if (!start) return;
		const dx = e.clientX - start.px;
		if (!start.moved && Math.abs(dx) < 4) return;
		start.moved = true;
		dragX = clamp(start.x + dx, 0, TRAVEL);
	}

	function onpointerup(e) {
		if (!start) return;
		const { moved } = start;
		start = null;
		pressed = false;

		if (moved) {
			commit(Math.round(dragX / HALF) - 1, dragX);
		} else {
			const rect = body.getBoundingClientRect();
			const next = clamp(pos + (e.clientX < rect.left + rect.width / 2 ? -1 : 1), -1, 1);
			commit(next, xOf(pos));
		}
	}

	function onpointercancel() {
		if (!start) return;
		start = null;
		pressed = false;
		moveTo(pos, dragX ?? xOf(pos));
	}

	function onkeydown(e) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		e.preventDefault();
		const next = clamp(pos + (e.key === 'ArrowLeft' ? -1 : 1), -1, 1);
		commit(next, xOf(pos));
	}
</script>

<div
	role="slider"
	tabindex="0"
	aria-label={label}
	aria-valuemin={-1}
	aria-valuemax={1}
	aria-valuenow={pos}
	aria-valuetext={VALUE_TEXT[pos + 1]}
	{onpointerdown}
	{onpointermove}
	{onpointerup}
	{onpointercancel}
	{onkeydown}
	style:width="{WIDTH}px"
	style:height="{HEIGHT}px"
	style:background-color={trackColor}
	style:box-shadow="inset 0 0 0 1px {ringColor}"
	class={cn(
		'relative shrink-0 cursor-grab touch-pan-y rounded-full outline-none select-none focus-visible:ring-1 focus-visible:ring-focus/70 active:cursor-grabbing',
		dragX === null && 'transition-[background-color,box-shadow] duration-200',
		className
	)}
>
	{#each [{ icon: xmarkIcon, left: PADDING, color: 'text-absent' }, { icon: checkIcon, left: PADDING + HALF + THUMB, color: 'text-present' }] as hint (hint.left)}
		<span
			aria-hidden="true"
			style:left="{hint.left}px"
			style:width="{HALF}px"
			style:opacity={hintOpacity * 0.7}
			class={cn(
				'pointer-events-none absolute inset-y-0 flex items-center justify-center fill-current [&_svg]:size-2.5',
				hint.color,
				dragX === null && 'transition-opacity duration-200'
			)}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
			{@html hint.icon}
		</span>
	{/each}

	<span
		bind:this={slide}
		style:width="{THUMB}px"
		style:height="{THUMB}px"
		style:top="{PADDING}px"
		style:left="{PADDING}px"
		style:transform="translateX({x}px)"
		class="pointer-events-none absolute"
	>
		<span
			bind:this={body}
			style:background-color={thumbColor}
			class={cn(
				'relative block size-full rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-[scale,background-color] duration-200',
				pressed && 'scale-x-[1.15] scale-y-[0.88]'
			)}
		>
			<span
				style:opacity={Math.max(0, lean)}
				class="absolute inset-0 flex items-center justify-center fill-current text-present-foreground [&_svg]:size-3"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html checkIcon}
			</span>
			<span
				style:opacity={Math.max(0, -lean)}
				class="absolute inset-0 flex items-center justify-center fill-current text-absent-foreground [&_svg]:size-3"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static build-time import, not user input -->
				{@html xmarkIcon}
			</span>
		</span>
	</span>
</div>
