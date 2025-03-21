<script>
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold text-green-300 mb-4">Pesanan Berhasil!</h1>
	<p class="text-lg">Terima kasih telah memesan 🎉</p>
	<p class="text-lg font-bold">Silahkan lanjutkan pembayaranmu di stand.</p>
	<img
		src="https://i.pinimg.com/736x/7a/f6/af/7af6af4026e8de5a18b3cc1ee9fcee36.jpg"
		alt="Zundamon hooray"
		class="m-4"
		width="124"
	/>
	<button
		class="mt-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
		on:click={() => goto('/')}
	>
		Mau pesan lagi?
	</button>
</div>
