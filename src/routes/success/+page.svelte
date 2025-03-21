<script>
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold text-green-600 mb-4">Pesanan Berhasil!</h1>
	<p class="text-lg">Terima kasih telah memesan 🎉</p>
	<button
		class="mt-6 px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition"
		on:click={() => goto('/')}
	>
		Mau pesan lagi?
	</button>
</div>
