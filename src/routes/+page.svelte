<script>
	import { deserialize } from '$app/forms';
	import bugUrl from '$lib/assets/bug-solid-full.svg';
	import calendarUrl from '$lib/assets/calendar-days-solid-full.svg';
	import githubUrl from '$lib/assets/github-brands-solid-full.svg';
	import starUrl from '$lib/assets/star-solid-full.svg';
	import virusUrl from '$lib/assets/viruses-solid-full.svg';
	import rankingUrl from '$lib/assets/ranking-star-solid-full.svg';
	import AttendanceBar from '$lib/components/AttendanceBar.svelte';
	import CreditFooter from '$lib/components/CreditFooter.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import AttendanceLog from '$lib/components/AttendanceLog.svelte';
	import BugReport from '$lib/components/BugReport.svelte';
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';
	import DayMark from '$lib/components/DayMark.svelte';
	import ExtraLog from '$lib/components/ExtraLog.svelte';
	import LeaveLog from '$lib/components/LeaveLog.svelte';
	import LoginPrompt from '$lib/components/LoginPrompt.svelte';
	import ResponseBtn from '$lib/components/ResponseBtn.svelte';
	import VEBtn from '$lib/components/VEBtn.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let attendanceOpen = $state(false);

	let loginOpen = $state(false);
	// set 10s timer to show login popout if unauthenticated
	$effect(() => {
		if (!data.demo) return;
		const timer = setTimeout(() => (loginOpen = true), 5_000);
		return () => clearTimeout(timer);
	});

	// block clicks if demo
	function gateDemo(event) {
		if (!data.demo) return;
		event.preventDefault();
		event.stopPropagation();
		loginOpen = true;
	}

	let errors = $state({ bug: '', feedback: '' });

	async function post(action, fields, keepalive = false) {
		const body = new FormData();
		for (const [key, value] of Object.entries(fields)) body.set(key, value);

		const res = await fetch(`?/${action}`, { method: 'POST', body, keepalive });
		return deserialize(await res.text());
	}

	// callAction for non-optimistic changes (bug report and feedback)
	// function submit defined below for optimistic updates
	async function callAction(action, fields, errorKey) {
		const result = await post(action, fields);

		if (result.type === 'success') {
			errors[errorKey] = '';
			await invalidateAll();
			return true;
		}

		errors[errorKey] = result.data?.message ?? 'Something went wrong.';
		return false;
	}

	// Optimistic changes still waiting on the server. The UI shows `data` (the
	// server's truth) with these applied on top. Pending items are inert, so
	// there is at most one op per item and requests can't race each other.


	// state.raw used to enable comparisons of savedWith
	// reassign array to trigger state update
	let ops = $state.raw([]); // pending ops {key, action, fields, savedWith?}
	let nextOp = 0; // used to make each op's key unique
	let failure = $state(null); // text for error dialog. null=>dialog closed

	function errorText(result) {
		// get error text from fail() responses from actions
		if (result.type === 'failure') return result.data?.message ?? `HTTP ${result.status}`;
		if (result.type === 'error') {
			const err = result.error;
			return err instanceof Error ? String(err) : (err?.message ?? `HTTP ${result.status}`);
		}
		return `Unexpected ${result.type} result`;
	}


	async function submit(action, fields) {
		const key = `${action}:${nextOp++}`;
		ops = [...ops, { key, action, fields }];

		let result;
		try {
			// keepalive so a change made just before closing the app still lands
			result = await post(action, fields, true);
		} catch (err) {
			result = { type: 'error', error: err };
		}

		if (result.type !== 'success') {
			// drop op and show err if req failed
			ops = ops.filter((op) => op.key !== key);
			failure = errorText(result);
			return false;
		}

		// if two requests are sent in quick succession
		// then both are faded 
		// but if reload #1 from invalidateAll is thrown away
		// the page flickers back to the old data state because that reload never ran as svelte discarded it in favor of reload #2
		// then reload #2 runs and both requests are updated
		// TO FIX THIS, THIS NOW REMOVES THE OP ONLY WHEN DATA CHANGES INSTEAD OF WHEN THE RELOAD FINISHES

		// note state of data after successful send to server
		ops = ops.map((op) => (op.key === key ? { ...op, savedWith: data } : op));

		try {
			await invalidateAll();
		} finally {
			// remove ops with old data state
			ops = ops.filter(isLive);
		}
		return true;
	}

	// unsaved, or saved but `data` hasn't been replaced since (invalidateAll reload NOT dropped)
	const isLive = (op) => !op.savedWith || op.savedWith === data;
	const live = $derived(ops.filter(isLive));

	// include pending attendance state
	const attendanceLog = $derived(
		data.attendanceLog.map((entry) => {
			const op = live.find((o) => o.action === 'ma' && o.fields.day === entry.day);
			return op ? { ...entry, status: op.fields.status, pending: true } : entry;
		})
	);

	// include pending extralog and leavelog states
	function overlay(entries, addAction, deleteAction) {
		const deleting = new Set(live.filter((o) => o.action === deleteAction).map((o) => o.fields.id));
		const adding = live
			.filter((o) => o.action === addAction)
			.map((o) => ({
				id: o.key,
				count: Number(o.fields.count),
				reason: o.fields.reason,
				pending: 'add'
			}));
		return [
			...entries.map((e) => (deleting.has(e.id) ? { ...e, pending: 'delete' } : e)),
			...adding
		];
	}

	const extra = $derived(overlay(data.extra, 'ae', 'de'));
	const leave = $derived(overlay(data.leave, 'al', 'dl'));

	// skip pending deleted entries when counting extras and leaves
	const counted = (entries) =>
		entries.reduce((sum, e) => (e.pending === 'delete' ? sum : sum + e.count), 0);

	
	const standard = $derived(attendanceLog.filter((e) => e.status === 'Present').length);
	const extraTotal = $derived(counted(extra));
	const leaveTotal = $derived(counted(leave));

	function handleAttendanceChange(entry, status) {
		return submit('ma', { day: entry.day, status });
	}

	let bugOpen = $state(false);
	let feedbackOpen = $state(false);
	let extraOpen = $state(false);
	let leavesOpen = $state(false);
</script>

<svelte:head><title>IIIT-H Sports Tracker</title></svelte:head>

<main
	class="relative mx-auto flex min-h-svh w-full max-w-lg flex-col gap-4 p-4 pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36"
	onclickcapture={gateDemo}
>
	{#if data.demo}
		<p
			class="absolute top-5 right-4 rounded-full bg-badge px-5 py-3 text-sm text-badge-foreground sm:top-9 md:top-13 lg:top-17 xl:top-21"
		>
			Sign In
		</p>
	{:else}
		<Profile
			username={data.username}
			class="absolute top-4 right-4 sm:top-8 md:top-12 lg:top-16 xl:top-20"
		/>
	{/if}
	<LoginPrompt open={loginOpen} />

	<AttendanceBar
		{standard}
		requirement={data.requirement}
		extra={extraTotal}
		leaves={leaveTotal}
	/>
	<div class="grid grid-cols-2 gap-4">
		<DayMark
			date={attendanceLog[0].date}
			onpresent={() => handleAttendanceChange(attendanceLog[0], 'Present')}
			onabsent={() => handleAttendanceChange(attendanceLog[0], 'Absent')}
			onunmark={() => handleAttendanceChange(attendanceLog[0], '-')}
			status={attendanceLog[0].status}
			pending={attendanceLog[0].pending}
					/>
		
		{#if attendanceLog[1]}
			<DayMark
				date={attendanceLog[1].date}
				onpresent={() => handleAttendanceChange(attendanceLog[1], 'Present')}
				onabsent={() => handleAttendanceChange(attendanceLog[1], 'Absent')}
				onunmark={() => handleAttendanceChange(attendanceLog[1], '-')}
				isToday={false}
				status={attendanceLog[1].status}
				pending={attendanceLog[1].pending}
			/>

		{:else}
			<!-- hide yesterday card on first day of the semester-->
			<DayMark
              date={new Date(+new Date(attendanceLog[0].date) - 86_400_000)}
              isToday={false}
              inert
              class="opacity-40 grayscale"
			/>
		{/if}
	</div>

	<AttendanceLog
		bind:open={attendanceOpen}
		entries={attendanceLog}
		onchange={handleAttendanceChange}
	/>
	<ExtraLog
		bind:open={extraOpen}
		entries={extra}
		ondelete={(entry) => submit('de', { id: entry.id })}
		onadd={(fields) => submit('ae', fields)}
	/>
	<LeaveLog
		bind:open={leavesOpen}
		entries={leave}
		ondelete={(entry) => submit('dl', { id: entry.id })}
		onadd={(fields) => submit('al', fields)}
	/>
	<BugReport
		bind:open={bugOpen}
		errormsg={errors.bug}
		onsubmit={(report) => callAction('br', { report }, 'bug')}
	/>
	<FeedbackForm
		bind:open={feedbackOpen}
		errormsg={errors.feedback}
		onsubmit={(fields) => callAction('fb', fields, 'feedback')}
	/>

	<AlertDialog.Root
		open={failure !== null}
		onOpenChange={(isOpen) => {
			if (!isOpen) failure = null;
		}}
	>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>That change didn't save</AlertDialog.Title>
				<AlertDialog.Description class="wrap-anywhere">{failure}</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action class="cursor-pointer" onclick={() => (failure = null)}>
					OK
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<div class="grid grid-cols-3 gap-4">
		<VEBtn icon={calendarUrl} text="Attendance" onclick={() => (attendanceOpen = true)} />
		<VEBtn icon={rankingUrl} text="Extra" onclick={() => (extraOpen = true)} />
		<VEBtn icon={virusUrl} text="Leaves" onclick={() => (leavesOpen = true)} />
	</div>

	<div class="mx-auto my-6 h-1.5 w-15 rounded-full bg-divider/15"></div>

	<div class="grid grid-cols-3 gap-4">
		<ResponseBtn icon={bugUrl} text="Bug report" onclick={() => (bugOpen = true)} />
		<ResponseBtn
			icon={githubUrl}
			text="Contribute"
			onclick={() =>
				window.open(
					'https://github.com/asaix/sports-tracker-iiith',
					'_blank',
					'noopener,noreferrer'
				)}
		/>
		<ResponseBtn
			icon={starUrl}
			text="Feedback"
			onclick={() => (feedbackOpen = true)}
		/>
	</div>

	<footer class="mt-auto flex flex-col items-center gap-1 pt-12">
		<CreditFooter people={[{ name: '@asaix', link: 'https://github.com/asaix' }]} />
		<p class="text-center text-[8px] text-muted-foreground/60">Not an official IIIT-H website.</p>
	</footer>
</main>
