<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();
</script>

{#if !['/adminboard'].includes(page.url.pathname)}
	<div
		class="fixed inset-0 w-full h-full bg-[url('https://cdnb.artstation.com/p/assets/images/images/052/214/949/large/porforever-03-passageway.jpg?1659253691')] bg-cover bg-center blur-lg brightness-60"
	></div>
{/if}

<!-- Main Content -->
<div class="relative">
	{@render children()}
</div>

<footer class="footer">
	<p>
		Made by
		<a href="https://github.com/Fschets" target="_blank" class="github-link">Fschets (Egalito)</a>
		for DUTA SMK Festival
	</p>
</footer>

<style>
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: center;
		font-size: 9pt;
		opacity: 0.5;
		padding: 5px;
		background: rgba(0, 0, 0, 0.05);
	}

	.github-link {
		text-decoration: none;
		color: inherit;
		font-weight: bold;
	}

	.github-link:hover {
		text-decoration: underline;
	}
</style>
