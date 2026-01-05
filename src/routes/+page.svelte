<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	// Optional: if a Supabase client is provided in $lib/supabase, use it
	// This keeps the app working even if the project isn't fully wired yet.
	let supabaseClient: any = null;
	let supabaseReady = false;
	let hasInteracted = false;
	let showAudioPrompt = false;
	let audioStarted = false;
	let audioEl: HTMLAudioElement | null = null;

	let cash = 0;
	let cashTimer: any;
	let transitioning = false;

	async function loadSupabase() {
		try {
			// Convention: projects usually export `supabase`.
			const mod = await import('$lib/supabase');
			supabaseClient = (mod as any).supabase ?? (mod as any).client ?? null;
			supabaseReady = !!supabaseClient;
		} catch {
			supabaseClient = null;
			supabaseReady = false;
		}
	}

	function startCashCounter() {
		clearInterval(cashTimer);
		cashTimer = setInterval(() => {
			// jittery endless counter
			cash += 1 + Math.floor(Math.random() * 7);
		}, 80);
	}

	function stopCashCounter() {
		clearInterval(cashTimer);
	}

	function setupAudio() {
		audioEl = new Audio('/audio/low-bass-drone.mp3');
		audioEl.loop = true;
		audioEl.preload = 'auto';
		audioEl.volume = 0.25;
	}

	async function tryAutoplay() {
		if (!audioEl) return;
		try {
			await audioEl.play();
			audioStarted = true;
			showAudioPrompt = false;
		} catch {
			audioStarted = false;
			// Autoplay likely blocked
			showAudioPrompt = true;
		}
	}

	function userInteract() {
		if (hasInteracted) return;
		hasInteracted = true;
		// Attempt audio after first user gesture
		tryAutoplay();
	}

	async function imHungry() {
		transitioning = true;
		// create anonymous session in Supabase if available
		if (supabaseReady && supabaseClient?.auth?.signInAnonymously) {
			try {
				await supabaseClient.auth.signInAnonymously();
			} catch {
				// ignore; still proceed
			}
		}

		// brief transition delay
		await new Promise((r) => setTimeout(r, 520));
		goto('/vaults');
	}

	onMount(async () => {
		await loadSupabase();
		setupAudio();
		startCashCounter();
		// Attempt autoplay on mount (will likely fail) then prompt
		tryAutoplay();

		return () => {
			stopCashCounter();
			if (audioEl) {
				audioEl.pause();
				audioEl.src = '';
			}
		};
	});
</script>

<svelte:window on:pointerdown={userInteract} on:keydown={userInteract} />

<div class="landing" data-transitioning={transitioning}>
	<div class="vignette" />
	<div class="grain" />

	<div class="center">
		<div class="title">ENTER THE DAIRY</div>
		<div class="sub">BLACK-SCREEN MILK MONEY PROTOCOL</div>

		<div class="cash">
			<span class="label">CASH</span>
			<span class="value">${cash.toLocaleString()}</span>
		</div>

		<div class="actions">
			<button class="hungry" on:click={imHungry} disabled={transitioning}>
				I'M HUNGRY
			</button>
		</div>

		{#if showAudioPrompt}
			<div class="audioPrompt">
				<div class="promptTitle">SOUND LOCKED</div>
				<div class="promptBody">Tap to enable low bass drone.</div>
				<button class="enable" on:click={() => tryAutoplay()}>
					ENABLE SOUND
				</button>
			</div>
		{:else if audioStarted}
			<div class="audioOn">DRONE: ON</div>
		{/if}
	</div>

	<div class="footer">© CHEESE BY DR MCGI</div>
</div>

<style>
	.landing {
		min-height: 100dvh;
		background: #000;
		color: #f3f3f3;
		display: grid;
		place-items: center;
		position: relative;
		overflow: hidden;
		cursor: url('/cursor/cheese-cursor.png') 14 14, auto;
		transition: filter 520ms ease, opacity 520ms ease;
	}
	.landing[data-transitioning='true'] {
		filter: blur(4px) brightness(0.7);
		opacity: 0.75;
	}
	.vignette {
		position: absolute;
		inset: -20%;
		background:
			radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 65%, rgba(0, 0, 0, 1) 100%);
		pointer-events: none;
	}
	.grain {
		position: absolute;
		inset: 0;
		background-image: url('/img/grain.png');
		opacity: 0.06;
		mix-blend-mode: overlay;
		pointer-events: none;
		animation: grain 1.8s steps(2) infinite;
	}
	@keyframes grain {
		0% {
			transform: translate3d(0, 0, 0);
		}
		25% {
			transform: translate3d(-2%, 1%, 0);
		}
		50% {
			transform: translate3d(1%, -2%, 0);
		}
		75% {
			transform: translate3d(2%, 2%, 0);
		}
		100% {
			transform: translate3d(0, 0, 0);
		}
	}

	.center {
		position: relative;
		text-align: center;
		padding: 3rem 1.25rem;
		max-width: 780px;
		width: min(92vw, 780px);
	}
	.title {
		font-size: clamp(2.2rem, 6vw, 4.25rem);
		letter-spacing: 0.35em;
		text-indent: 0.35em;
		font-weight: 700;
	}
	.sub {
		margin-top: 0.75rem;
		opacity: 0.65;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		font-size: 0.8rem;
	}
	.cash {
		margin: 2.25rem auto 1.75rem;
		display: inline-flex;
		gap: 0.75rem;
		align-items: baseline;
		border: 1px solid rgba(255, 255, 255, 0.18);
		padding: 0.9rem 1.1rem;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(6px);
	}
	.cash .label {
		opacity: 0.65;
		letter-spacing: 0.22em;
		font-size: 0.75rem;
	}
	.cash .value {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.06em;
		font-size: 1.4rem;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}
	button {
		appearance: none;
		border: 1px solid rgba(255, 255, 255, 0.22);
		background: rgba(255, 255, 255, 0.04);
		color: #fff;
		padding: 0.95rem 1.25rem;
		border-radius: 14px;
		font-weight: 700;
		letter-spacing: 0.18em;
		cursor: inherit;
		transition: transform 120ms ease, background 200ms ease, border-color 200ms ease;
	}
	button:hover {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.32);
	}
	button:active {
		transform: translateY(0px);
	}
	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.audioPrompt {
		margin: 1.5rem auto 0;
		max-width: 420px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(0, 0, 0, 0.35);
		border-radius: 16px;
		padding: 1rem 1rem;
	}
	.promptTitle {
		letter-spacing: 0.22em;
		font-weight: 700;
		font-size: 0.75rem;
		opacity: 0.75;
	}
	.promptBody {
		margin-top: 0.4rem;
		opacity: 0.7;
		font-size: 0.9rem;
	}
	.enable {
		margin-top: 0.75rem;
		width: 100%;
	}
	.audioOn {
		margin-top: 1.25rem;
		opacity: 0.55;
		letter-spacing: 0.22em;
		font-size: 0.72rem;
	}

	.footer {
		position: absolute;
		bottom: 16px;
		left: 0;
		right: 0;
		text-align: center;
		opacity: 0.35;
		font-size: 0.75rem;
		letter-spacing: 0.18em;
	}
</style>
