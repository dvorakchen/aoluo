import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Pagination from './pagination.svelte';

describe('Pagination.svelte', () => {
	it('renders correctly with small total pages', async () => {
		render(Pagination, { page: 1, totalPages: 5 });

		// 应该显示 1 2 3 4 5，且不显示省略号
		for (let i = 1; i <= 5; i++) {
			await expect
				.element(page.getByRole('radio', { name: String(i), exact: true }))
				.toBeInTheDocument();
		}
		await expect
			.element(page.getByRole('radio', { name: '...', exact: true }))
			.not.toBeInTheDocument();
	});

	it('renders correctly with many pages at start', async () => {
		render(Pagination, { page: 1, totalPages: 20 });

		// 靠近开头逻辑：显示 1 2 3 4 5 6 7 8 9 ... 20
		for (let i = 1; i <= 9; i++) {
			await expect
				.element(page.getByRole('radio', { name: String(i), exact: true }))
				.toBeInTheDocument();
		}
		await expect.element(page.getByRole('radio', { name: '...', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: '20', exact: true })).toBeInTheDocument();
	});

	it('renders correctly with many pages in middle', async () => {
		render(Pagination, { page: 15, totalPages: 30 });

		// 中间逻辑 (SIDE_COUNT=4)：显示 1 ... 12 13 14 15 16 17 18 19 ... 30
		await expect.element(page.getByRole('radio', { name: '1', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: '12', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: '15', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: '19', exact: true })).toBeInTheDocument();
		await expect.element(page.getByRole('radio', { name: '30', exact: true })).toBeInTheDocument();

		const dots = page.getByRole('radio', { name: '...', exact: true });
		await expect.element(dots.first()).toBeInTheDocument();
	});

	it('calls onPageChange when clicking a page', async () => {
		const onPageChange = vi.fn();
		render(Pagination, { page: 1, totalPages: 10, onPageChange });

		const page2 = page.getByRole('radio', { name: '2', exact: true });
		await userEvent.click(page2);

		expect(onPageChange).toHaveBeenCalledWith(2);
	});

	it('navigates with previous and next buttons', async () => {
		const onPageChange = vi.fn();
		render(Pagination, { page: 2, totalPages: 10, onPageChange });

		const prevBtn = page.getByRole('button', { name: '«' });
		const nextBtn = page.getByRole('button', { name: '»' });

		// 1. 点击 Prev: 2 -> 1
		await userEvent.click(prevBtn);
		expect(onPageChange).toHaveBeenLastCalledWith(1);

		// 2. 此时本地 page 已变为 1，点击 Next: 1 -> 2
		await userEvent.click(nextBtn);
		expect(onPageChange).toHaveBeenLastCalledWith(2);
	});

	it('disables previous button on first page', async () => {
		render(Pagination, { page: 1, totalPages: 10 });
		const prevBtn = page.getByRole('button', { name: '«' });
		await expect.element(prevBtn).toBeDisabled();
	});

	it('disables next button on last page', async () => {
		render(Pagination, { page: 10, totalPages: 10 });
		const nextBtn = page.getByRole('button', { name: '»' });
		await expect.element(nextBtn).toBeDisabled();
	});
});
