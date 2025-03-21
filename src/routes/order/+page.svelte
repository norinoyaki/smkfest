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

	const sizes = ['small', 'medium', 'large'];
	let selectedSize = writable('medium');
	let quantity = writable(1);
	let buyerName = writable(''); // New state for buyer name
	let loading = writable(false); // Track loading state

	function getPrice() {
		return product[$selectedSize] * $quantity;
	}

	async function addOrder() {
		loading.set(true); // Set loading state

		const { data, error } = await supabase.from('pesanan').insert([
			{
				pesanan: product.title,
				topping: [],
				kuantitas: $quantity,
				harga: product[$selectedSize],
				total_harga: getPrice(),
				status: 'pending',
				nama_pembeli: $buyerName // Adding buyer name to the database
			}
		]);

		if (error) {
			console.error('Error inserting data:', error);
			goto('/error');
		} else {
			console.log('Data inserted successfully:', data);
			goto('/success');
		}

		loading.set(false); // Reset loading state
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold mt-12 mb-8">{product.title}</h1>
	<img
		src={product.image}
		alt={product.title}
		class="w-64 h-82 object-cover rounded-lg shadow-lg mb-4"
	/>

	<div class="p-4 rounded-lg shadow-md w-72 text-center">
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
			<label class="block mt-4 mb-4">Ukuran:</label>
			<select bind:value={$selectedSize} class="p-2 bg-neutral-800 rounded-md w-full">
				{#each sizes as size}
					<option value={size}>{size.charAt(0).toUpperCase() + size.slice(1)}</option>
				{/each}
			</select>
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

		<div class="flex justify-center w-full">
			<button
				class="mt-8 mb-8 w-32 h-11 bg-green-700 text-white rounded-md hover:bg-green-600 transition flex items-center justify-center mx-auto"
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
