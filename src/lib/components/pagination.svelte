<!--  分页组件 -->

<script module lang="ts">
	export type PaginationProps = {
		page?: number; // 当前页码，默认为 1
		totalPages: number; // 总页数
		onPageChange?: (page: number) => void; // 页码改变时的回调函数
	};
</script>

<script lang="ts">
	let { page = 1, totalPages, onPageChange }: PaginationProps = $props();

	const SIDE_COUNT = 4; // 当前页两侧显示的页码数量

	const pageList = $derived.by(() => {
		if (totalPages <= 10) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		// 如果靠近开头
		if (page < 10 - SIDE_COUNT) {
			return Array.from({ length: 9 }, (_, i) => i + 1);
		}

		// 计算当前页附近的范围
		const start = Math.max(1, page - SIDE_COUNT + 1);
		const end = Math.min(totalPages, page + SIDE_COUNT);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	});

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages && p !== page) {
			page = p;
			onPageChange?.(p);
		}
	}
</script>

<div class="join">
	<button class="btn join-item" disabled={page <= 1} onclick={() => goToPage(page - 1)}>«</button>

	{#if pageList[0] > 1}
		<input
			class="btn join-item btn-square"
			type="radio"
			name="options"
			aria-label="1"
			onclick={() => goToPage(1)}
		/>
		{@render dot()}
	{/if}

	{#each pageList as cur (cur)}
		<input
			class="btn join-item btn-square"
			type="radio"
			name="options"
			aria-label={String(cur)}
			onclick={() => goToPage(cur)}
			checked={page === cur}
		/>
	{/each}

	{#if pageList[pageList.length - 1] < totalPages}
		{@render dot()}
		<input
			class="btn join-item btn-square"
			type="radio"
			name="options"
			aria-label={String(totalPages)}
			onclick={() => goToPage(totalPages)}
		/>
	{/if}

	<button class="btn join-item" disabled={page >= totalPages} onclick={() => goToPage(page + 1)}>
		»
	</button>
</div>

{#snippet dot()}
	<input class="btn join-item btn-square" type="radio" aria-label="..." disabled />
{/snippet}
