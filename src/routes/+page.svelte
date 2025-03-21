<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let product = [
		{
			id: 1,
			title: 'Alpukat Kocok',
			image: '/assets/Alpukat_Kocok.jpeg',
			price: 10000
		},
		{
			id: 2,
			title: 'Blackcurrent Tea',
			image: '/assets/Blackcurrent_Tea.jpeg',
			price: 10000
		},
		{
			id: 3,
			title: 'Caramel Coffee Latte',
			image: '/assets/Caramel_Coffee_Latte.jpeg',
			price: 12000
		},
		{
			id: 4,
			title: 'Hazelnut Coffee Latte',
			image: '/assets/Hazelnut_Coffee_Latte.jpeg',
			price: 12000
		},
		{
			id: 5,
			title: 'Hot Coffee Latte',
			image: '/assets/Hot_Coffee_Latte.jpeg',
			price: 10000
		},
		{
			id: 6,
			title: 'Lemon Jasmine Tea',
			image: '/assets/Lemon_Jasmine_Tea.jpeg',
			price: 10000
		},
		{
			id: 7,
			title: 'Lychee Squash',
			image: '/assets/Lychee_Squash.jpeg',
			price: 10000
		},
		{
			id: 8,
			title: 'Lychee Tea',
			image: '/assets/Lychee_Tea.jpeg',
			price: 10000
		},
		{
			id: 9,
			title: 'Mangga Kocok',
			image: '/assets/Mangga_Kocok.jpeg',
			price: 10000
		},
		{
			id: 10,
			title: 'Manggo Squash',
			image: '/assets/Manggo_Squash.jpeg',
			price: 10000
		},
		{
			id: 11,
			title: 'Manggo Tea',
			image: '/assets/Manggo_Tea.jpeg',
			price: 10000
		},
		{
			id: 12,
			title: 'Orange Squash',
			image: '/assets/Orange_Squash.jpeg',
			price: 10000
		},
		{
			id: 13,
			title: 'Pineapple Smoothies',
			image: '/assets/Pineapple_Smoothies.jpeg',
			price: 12000
		},
		{
			id: 14,
			title: 'Strawberry Tea',
			image: '/assets/Strawberry_Tea.jpeg',
			price: 10000
		}
	];

	let container: any;
	let isDown = false;
	let startX: any;
	let scrollLeft: any;
	let autoScrollInterval: any;
	let isDragging = false;

	// Duplicate the product list for infinite looping
	product = [...product, ...product];

	// Auto-scrolling function
	function startAutoScroll() {
		stopAutoScroll(); // Ensure no duplicate intervals
		autoScrollInterval = setInterval(() => {
			if (!container) return;
			container.scrollLeft += 1.5; // Adjust speed

			// Check if we reached the halfway mark, reset to seamless loop
			if (container.scrollLeft >= container.scrollWidth / 2) {
				container.scrollLeft = 0;
			}
		}, 20); // Adjust interval for smoothness
	}

	function stopAutoScroll() {
		clearInterval(autoScrollInterval);
	}

	// Start/Stop scrolling on user interaction
	function startDragging(event: any) {
		isDown = true;
		isDragging = false;
		startX = event.pageX - container.offsetLeft;
		scrollLeft = container.scrollLeft;
		container.classList.add('cursor-grabbing');
	}

	function stopDragging(event: any) {
		isDown = false;
		container.classList.remove('cursor-grabbing');

		// If the user didn't drag, treat it as a click
		if (!isDragging) {
			const item = event.target.closest('li'); // Ensure it’s a list item
			if (item) {
				selectProduct(item.dataset);
			}
		}
	}

	function moveDragging(event: any) {
		if (!isDown) return;
		event.preventDefault();
		isDragging = true; // <-- Mark as dragging

		const x = event.pageX - container.offsetLeft;
		const walk = x - startX;
		container.scrollLeft = scrollLeft - walk;
	}

	function startTouch(event: any) {
		isDown = true;
		isDragging = false;
		startX = event.touches[0].pageX - container.offsetLeft;
		scrollLeft = container.scrollLeft;
	}

	function moveTouch(event: any) {
		if (!isDown) return;
		isDragging = true;
		const x = event.touches[0].pageX - container.offsetLeft;
		const walk = x - startX;
		container.scrollLeft = scrollLeft - walk;
	}

	function stopTouch(event: any) {
		isDown = false;

		if (!isDragging) {
			const item = event.target.closest('li');
			if (item) {
				selectProduct(item.dataset);
			}
		}
	}

	onMount(() => {
		startAutoScroll();
	});

	onDestroy(() => {
		stopAutoScroll();
	});

	import { selectedProduct } from '$lib/stores';
	import { goto } from '$app/navigation';

	function selectProduct(product: any) {
		selectedProduct.set(product);
		goto('/order');
	}
</script>

<div class="flex flex-col justify-center items-center min-h-screen">
	<!-- Heading -->
	<h1 class="text-2xl font-bold text-center mb-12">Mau minum apa hari ini?</h1>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={container}
		class="w-full overflow-x-auto whitespace-nowrap px-4 no-scrollbar cursor-grab select-none"
		onmousedown={startDragging}
		onmouseup={stopDragging}
		onmouseleave={stopDragging}
		onmousemove={moveDragging}
	>
		<ul class="flex gap-6 w-max" role="list">
			{#each product as item}
				<li
					class="relative w-64 h-82 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
					role="listitem"
					aria-labelledby={`title-${item.id}`}
					data-title={item.title}
					data-image={item.image}
					data-price={item.price}
					onmousedown={startDragging}
					onmouseup={stopDragging}
					onmousemove={moveDragging}
					ontouchstart={startTouch}
					ontouchmove={moveTouch}
					ontouchend={stopTouch}
				>
					<img
						src={item.image}
						alt={item.title}
						class="absolute inset-0 w-full h-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
					<div class="absolute inset-0 flex flex-col justify-end text-white p-6">
						<h2 id={`title-${item.id}`} class="text-xl font-bold">{item.title}</h2>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
	* {
		font-family: 'Josefin Sans', sans-serif;
		font-optical-sizing: auto;
		font-style: normal;
		color: white;
	}
	/* Hide scrollbar */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	/* Cursor styles for dragging */
	.cursor-grab {
		cursor: grab;
	}
</style>
