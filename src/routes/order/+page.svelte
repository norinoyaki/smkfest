<script lang="ts">
	import { goto } from '$app/navigation';
	import { selectedProduct } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { supabase } from '$lib/supabase';

	let product: any;

	const unsubscribe = selectedProduct.subscribe((value) => (product = value));
	onDestroy(() => unsubscribe());

	if (!product) {
		goto('/');
	}

	let quantity = writable(1);
	let buyerName = writable('');
	let loading = writable(false);
	let addIceCream = writable(false);

	function getPrice() {
		let basePrice = product.price * $quantity;
		if ($addIceCream) {
			basePrice += 3000 * $quantity;
		}
		return basePrice;
	}

	async function addOrder() {
		loading.set(true);

		const toppings = [];
		if ($addIceCream) toppings.push('Ice Cream Topping');

		const { data, error } = await supabase.from('pesanan').insert([
			{
				pesanan: product.title,
				topping: toppings,
				kuantitas: $quantity,
				harga: product.price,
				total_harga: getPrice(),
				status: 'pending',
				nama_pembeli: $buyerName
			}
		]);

		if (error) {
			console.error('Error inserting data:', error);
			goto('/error');
		} else {
			console.log('Data inserted successfully:', data);
			goto('/success');
		}

		loading.set(false);
	}
</script>

<!-- Back Button (Sticky, Transparent, With Arrow) -->
<button
	on:click={() => goto('/')}
	class="sticky top-4 left-4 text-white bg-transparent px-4 py-2 rounded-md hover:bg-white/10 transition flex items-center"
>
	<span class="text-2xl">←</span>
</button>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold mt-12 mb-8">{product.title}</h1>
	<img
		src={product.image}
		alt={product.title}
		class="w-64 h-82 object-cover rounded-lg shadow-lg mb-4"
	/>

	<div class="p-4 rounded-lg w-72 text-center">
		<p class="text-lg font-semibold mb-8">Harga: Rp {getPrice()}</p>
		<div class="mt-2">
			<label class="block mt-4 mb-2">Nama Pembeli:</label>
			<input
				type="text"
				bind:value={$buyerName}
				class="p-2 bg-neutral-800 rounded-md w-full"
				placeholder="Masukkan nama"
			/>
		</div>
		<div class="mt-2">
			<label class="block mt-4 mb-4">Kuantitas:</label>
			<input
				type="number"
				min="1"
				bind:value={$quantity}
				class="p-2 bg-neutral-800 rounded-md w-full"
			/>
		</div>
		<div class="mt-4 items-center justify-center gap-5">
			<label class="block mt-4 mb-4">Tambah Add-on (per kuantitas):</label>
			<input
				type="checkbox"
				bind:checked={$addIceCream}
				class="w-5 h-5 justify-center items-center"
			/>
			<label class="ml-2 justify-center items-center">Ice Cream Topping</label>
			<label class="justify-center items-center">(+ Rp 3000)</label>
		</div>
		<div class="flex justify-center w-full">
			<button
				class="mt-8 mb-28 w-32 h-11 bg-green-700 text-white rounded-md hover:bg-green-600 transition flex items-center justify-center mx-auto"
				on:click={() => addOrder()}
				disabled={$loading}
			>
				{#if $loading}
					<div
						class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
					></div>
				{:else}
					Beli
				{/if}
			</button>
		</div>
	</div>
</div>
