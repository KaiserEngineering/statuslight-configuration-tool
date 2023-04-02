<!-- The fixed stylesheet -->
<svelte:head>
	<style>
		:root {
			--toastContainerTop: 1rem;
			--toastContainerRight: auto;
			--toastContainerBottom: auto;
			--toastContainerLeft: calc(50vw - 8rem);
		}
		* {
			box-sizing: border-box;
		}
		html {
			line-height: 1.15;
		}
		body {
			margin: 0;
			padding: 0;
			font-family: system-ui, -apple-system, 'Segoe UI', Roboto;
		}
		.min-h-screen {
			min-height: 100vh;
		}
		.bg-white {
			background-color: #fff;
		}
		.bg-gray-100 {
			background-color: #f3f4f6;
		}
		.bg-gray-200 {
			background-color: #e5e7eb;
		}
		.bg-blue-300 {
			background-color: #93c5fd;
		}
		.hover\:bg-blue-200:hover {
			background-color: #bfdbfe;
		}
		.active\:bg-blue-100:active {
			background-color: #dbeafe;
		}
		.dark .dark\:bg-gray-900 {
			background-color: #111827;
		}
		.dark .dark\:bg-blue-800 {
			background-color: #1e40af;
		}
		.dark .dark\:bg-blue-900 {
			background-color: #1e3a8a;
		}
		.dark .dark\:hover\:bg-blue-600:hover {
			background-color: #2563eb;
		}
		.dark .dark\:active\:bg-blue-500:active {
			background-color: #3b82f6;
		}
		.rounded-sm {
			border-radius: 0.125rem;
		}
		.rounded {
			border-radius: 0.25rem;
		}
		.rounded-full {
			border-radius: 99px;
		}
		.border-none {
			border-style: none;
		}
		.inline-block {
			display: inline-block;
		}
		.table {
			display: table;
		}
		.font-medium {
			font-weight: 500;
		}
		.font-semibold {
			font-weight: 600;
		}
		.font-bold {
			font-weight: 700;
		}
		.h-screen {
			height: 100vh;
		}
		.text-sm {
			font-size: 0.875rem;
			line-height: 1.25rem;
		}
		.text-base {
			font-size: 1rem;
			line-height: 1.5rem;
		}
		.text-xl {
			font-size: 1.25rem;
			line-height: 1.75rem;
		}
		.mx-auto {
			margin: auto;
		}
		.mb-5 {
			margin-bottom: 1.25rem;
		}
		.mt-10 {
			margin-top: 2.5rem;
		}
		.max-w-sm {
			max-width: 24rem;
		}
		.focus\:outline-none:focus {
			outline: 2px solid transparent;
			outline-offset: 2px;
		}
		.overflow-hidden {
			overflow: hidden;
		}
		.py-1 {
			padding-top: 0.25rem;
			padding-bottom: 0.25rem;
		}
		.py-3 {
			padding-top: 0.75rem;
			padding-bottom: 0.75rem;
		}
		.px-3 {
			padding-left: 0.75rem;
			padding-right: 0.75rem;
		}
		.py-4 {
			padding-top: 1rem;
			padding-bottom: 1rem;
		}
		.px-6 {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		* {
			--tw-shadow: 0 0 #0000;
		}
		.shadow {
			--tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
			box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
				var(--tw-shadow);
		}
		.text-gray-700 {
			color: #374151;
		}
		.text-gray-800 {
			color: #1f2937;
		}
		.dark .dark\:text-white {
			color: #fff;
		}
		.w-full {
			width: 100%;
		}
		.transition {
			transition: 0.3s;
		}
		.mr-2 {
			margin-right: 0.5rem;
		}
	</style>
</svelte:head>
