<script lang="ts">
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';

	let supabase: any;

	if (browser) {
		import('$lib/supabase').then((module) => {
			supabase = module.supabase;
			fetchOrders(); // Ensure orders are fetched AFTER supabase is initialized
		});
	}

	let pesanan: any = [];

	onMount(async () => {
		while (!supabase) {
			await new Promise((resolve) => setTimeout(resolve, 100)); // Wait until supabase is loaded
		}

		try {
			await fetchOrders();
			supabase
				.channel('orders')
				.on('postgres_changes', { event: '*', schema: 'public', table: 'pesanan' }, fetchOrders)
				.subscribe();
		} catch (e) {
			console.log(e);
		}
	});

	async function fetchOrders() {
		if (!supabase) {
			console.warn('Supabase is not initialized yet!');
			return;
		}

		const { data, error } = await supabase
			.from('pesanan')
			.select('*')
			.order('tid', { ascending: false });

		if (error) {
			console.error('Supabase Fetch Error:', error);
			return;
		}

		pesanan = data;
	}

	async function updateStatus(id: number, status: string) {
		const { error } = await supabase.from('pesanan').update({ status }).eq('tid', id);

		if (!error) {
			await fetchOrders(); // Refresh orders after update
		}
	}

	// Calculate total pemasukan
	$: totalPemasukan = pesanan.reduce(
		(sum: any, order: any) => sum + (order.status === 'done' ? order.total_harga : 0),
		0
	);

	// Count pending and completed orders
	$: pendingOrders = pesanan.filter((order: any) => order.status === 'pending').length;
	$: completedOrders = pesanan.filter((order: any) => order.status === 'done').length;
</script>

<div class="m-4 font-bold text-lg">Admin Panel</div>
<div class="m-4 font-bold text-l">
	Total Pemasukan: {totalPemasukan} |
	<span class="text-yellow-500">Order yang belum selesai: {pendingOrders}</span> |
	<span class="text-green-500">Order yang telah selesai: {completedOrders}</span>
</div>
<div class="mx-4 my-2 text-m">
	List ini di sortir secara descending, pesanan baru muncul paling atas dan lama dibawah.
</div>
<div class="mx-4 mb-4 text-m">
	Klik tulisan biru/"pending" untuk menandakan pesanan telah selesai. Klik tulisan merah/id untuk
	menandakan pesanan batal.
</div>

<table class="table-auto w-full border-separate border border-neutral-800">
	<thead>
		<tr class="bg-neutral-800">
			<th class="border border-neutral-800 p-2">ID</th>
			<th class="border border-neutral-800 p-2">Nama Pembeli</th>
			<th class="border border-neutral-800 p-2">Pesanan</th>
			<th class="border border-neutral-800 p-2">Topping</th>
			<th class="border border-neutral-800 p-2">Kuantitas</th>
			<th class="border border-neutral-800 p-2">Harga</th>
			<th class="border border-neutral-800 p-2">Total Harga</th>
			<th class="border border-neutral-800 p-2">Status</th>
		</tr>
	</thead>
	<tbody>
		{#each pesanan as order}
			<tr class="border border-neutral-800">
				<td class="border border-neutral-800 p-2">
					{#if order.status !== 'canceled' && order.status !== 'done'}
						<button
							class="text-red-500 underline cursor-pointer"
							on:click={() => updateStatus(order.tid, 'canceled')}
						>
							{order.tid}
						</button>
					{:else}
						<span>{order.tid}</span>
					{/if}
				</td>
				<td class="border border-neutral-800 p-2">{order.nama_pembeli ?? 'N/A'}</td>
				<td class="border border-neutral-800 p-2">{order.pesanan}</td>
				<td class="border border-neutral-800 p-2">{JSON.stringify(order.topping)}</td>
				<td class="border border-neutral-800 p-2">{order.kuantitas}</td>
				<td class="border border-neutral-800 p-2">{order.harga}</td>
				<td class="border border-neutral-800 p-2">{order.total_harga}</td>
				<td class="border border-neutral-800 p-2">
					{#if order.status === 'pending'}
						<button
							class="text-blue-500 underline cursor-pointer"
							on:click={() => updateStatus(order.tid, 'done')}
						>
							Pending
						</button>
					{:else}
						<span>{order.status}</span>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
