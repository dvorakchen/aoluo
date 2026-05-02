# Badana

A full-stack application template built with SvelteKit 5 + Better Auth + Drizzle ORM, featuring a responsive WebSocket architecture and a complete Docker deployment solution.

## 🌟 Features

- **SvelteKit 5 (Runes)**: Leverages the latest rune system for ultimate reactive performance.
- **Better Auth**: Robust authentication solution supporting email/password, organization management, and phone login.
- **Drizzle ORM**: Type-safe database operations with migration support.
- **WebSocket Architecture**:
  - **Dev Environment**: Vite plugin with manual upgrade handling to separate business WS from HMR.
  - **Production**: Custom Node.js server for high-performance WS support on the same port.
- **Dockerized Deployment**: Multi-stage Dockerfile and optimized Docker Compose configuration.

## 🚀 Quick Start

### 1. Prerequisites

Copy the environment template and fill in the necessary configurations:

```bash
cp .env.example .env
```

### 2. Development

```bash
pnpm install
pnpm dev
```

URL: `http://localhost:5173`
_WS URL: `ws://localhost:5173/ws`_

### 3. Database Operations

```bash
pnpm db:push      # Sync schema to database
pnpm db:studio    # Open database GUI
```

## 🐳 Docker Production Deployment

The project is deeply optimized for Docker. Start the app and database with a single command:

```bash
docker compose up --build -d
```

Default URL: `http://127.0.0.1:3000`

### Critical Environment Variables

In production, ensure these variables are correctly set in `compose.yaml`:

- `ORIGIN`: The primary identity of the SvelteKit app (Required for CSRF checks).
- `BETTER_AUTH_URL`: Base URL for authentication.
- `PUBLIC_ORIGIN`: Base URL for client-side WebSocket connections.
- `ADMIN_DATABASE_URL`: Production database connection string.

## 🛠️ Architecture Details

### WebSocket Implementation

Uses "Path Separation". All business WebSocket connections request the `/ws` path to avoid conflicts with Vite's HMR service during development.

### Production Entry Point (server.js)

Instead of the standard `node build`, we use `server.js` as the entry point. It manually mounts the WebSocket service and forwards HTTP requests to the SvelteKit Handler, ensuring WebSocket availability in `adapter-node` deployments.

## 📜 License

Apache-2.0

# Development Manual

> Refer to the following manual when performing secondary development.

## Database

Uses PostgreSQL, heavily utilizing PG-specific capabilities such as `Row Level Security`. Dates use the `timestampz` format for convenient timezone tracking.

If you use other databases, you may encounter compatibility issues and need to adjust accordingly.

## i18n

Uses the solution provided by `paraglide`.

i18n in the database uses a JSON format:

```ts
export type DbI18nField =
	| {
			/**
			 * Default text to display when no locale-specific text is available.
			 */
			default: string;
			/**
			 * Locale-specific text.
			 *
			 * zh: Chinese
			 * en: English
			 */
			[K: string]: string;
	  }
	| { [K: string]: string };
```

This is stored in database fields in JSON format. Use `i18nFromJSON(DbI18nField)` on the client to extract the text corresponding to the current locale.

## Styling

Uses `DaisyUI`.

## Components

### table.svelte

The `table.svelte` component is recommended for displaying tables on the client side.

Example:

```svelte
<Table
	checkable={true}
	columns={[
		{
			field: 'name',
			display: `Team Name`
		},
		{
			field: 'manager',
			display: 'Manager'
		},
		{
			field: 'memberCount',
			display: 'Member Count'
		}
	]}
	{list}
>
	{#snippet name(row: RowType)}
		{i18nFromJSON(row.name)}
	{/snippet}

	{#snippet manager(row: RowType)}
		{row.manager?.displayUsername}
	{/snippet}

	{#snippet actions(row: RowType)}
		<a class="btn" href={resolve(`/detail/${row.id}`)}>{m.details()}</a>
	{/snippet}
</Table>

```

To display columns in the table, pass `columns`:

```ts
export type Col = {
	// Column field, the component will use this to retrieve data from 'list'
	field: string;
	// Display name of the column
	display: string;
};
```

Pass the table data to `list`:

```ts
type list: T[]
```

Example:

```svelte
<table
	columns={[
		{
			field: 'name',
			display: `Team Name`
		},
		{
			field: 'manager',
			display: 'Manager'
		},
		{
			field: 'memberCount',
			display: 'Member Count'
		}
	]}
	list={[
		{ name: 'Dev', manager: 'Alex', memberCount: '10' },
		{ name: 'Resource', manager: 'Bab', memberCount: '5' }
	]}
></table>
```

By default, the `name` column will display the value of the `name` field for that row.

You can also pass a `Snippet` to override the default display behavior:

```svelte
<table
	columns={[
		{
			field: 'name',
			display: `Team Name`
		},
		{
			field: 'manager',
			display: 'Manager'
		},
		{
			field: 'memberCount',
			display: 'Member Count'
		}
	]}
	list={[
		{ name: 'Dev', manager: 'Alex', memberCount: '10' },
		{ name: 'Resource', manager: 'Bab', memberCount: '5' }
	]}
>
  <!-- When displaying 'manager', the following Snippet will be used -->
  <!-- Originally displaying 'Alex', now displaying 'Bad Alex' -->
  {#snippet manager(row: RowType)}
		{'Bad ' + row.manager}
	{/snippet}
</table>
```

Note that the `actions` Snippet is reserved, so do not use `actions` as a field name in columns.

Pass `checkable={true}` to the `table` to display checkboxes on the left side:

```svelte
<table checkable={true}></table>
```

Use the `actions` Snippet to display action buttons on the far right of each row:

```svelte
<table>
  <!--
  ...
  -->
	{#snippet actions(row: RowType)}
		<a class="btn" href={resolve(`/detail/${row.id}`)}>Details</a>
    <button>Delete</button>
	{/snippet}
</table>
```
