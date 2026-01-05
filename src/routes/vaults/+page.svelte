<script lang="ts">
	import { onMount } from 'svelte';

	let pulse = 0;
	let timer: any;

	onMount(() => {
		timer = setInterval(() => (pulse = (pulse + 1) % 1000), 60);
		return () => clearInterval(timer);
	});
</script>

<div class="vaults">
	<div class="vignette" />
	<div class="grain" />

	<div class="copy">
		<div class="title">VAULTS</div>
		<div class="dominance">LOCKED VAULT DOMINANCE</div>
		<div class="body">
			Access is sealed. The cheese does not negotiate.
		</div>
		<div class="sig">SESSION: ANON • CLEARANCE: NONE • PULSE: {pulse}</div>
	</div>
</div>

<style>
	.vaults {
		min-height: 100dvh;
		background: #050505;
		color: #f3f3f3;
		display: grid;
		place-items: center;
		position: relative;
		overflow: hidden;
		cursor: url('/cursor/cheese-cursor.png') 14 14, auto;
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

	.copy {
		position: relative;
		text-align: center;
		padding: 3rem 1.25rem;
		max-width: 820px;
	}
	.title {
		font-size: clamp(2rem, 6vw, 4rem);
		letter-spacing: 0.32em;
		text-indent: 0.32em;
		font-weight: 800;
	}
	.dominance {
		margin-top: 0.8rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		opacity: 0.7;
	}
	.body {
		margin-top: 1.6rem;
		opacity: 0.7;
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.sig {
		margin-top: 2.25rem;
		opacity: 0.45;
		letter-spacing: 0.18em;
		font-size: 0.72rem;
	}
</style>
