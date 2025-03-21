<script>
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold text-red-600 mb-4">Pesanan Gagal</h1>
	<p class="text-lg">Terjadi kesalahan. Silakan coba lagi 😢</p>
	<button
		class="mt-6 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
		on:click={() => goto('/')}
	>
		Coba lagi
	</button>
</div>
