<script lang="ts">
	import { page } from '$app/stores';
</script>

<footer class="z-50 bg-vesuvius-700 text-white" style:--tag="footer">
	<div class="mx-auto flex h-full w-full max-w-md px-6 py-1">
		<nav class="flex-1">
			<ul class="flex justify-evenly pt-2">
				<li class="flex items-center">
					<a
						href="/"
						class={`flex flex-col items-center justify-center [&_svg]:hover:fill-vesuvius-300 ${
							$page.url.pathname === '/' ? '[&_svg]:fill-vesuvius-400' : ''
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 576 512"
							class="mx-auto h-6 w-6 fill-white"
						>
							<path
								d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
							/>
						</svg>
						<span class="sr-only">Home</span>
					</a>
				</li>

				<li class="flex items-center">
					<a
						href="/favorites"
						class={`flex flex-col items-center justify-center [&_svg]:hover:fill-red-500 ${
							$page.url.pathname === '/favorites' ? '[&_svg]:fill-red-600' : ''
						}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 512 512"
							class="mx-auto h-6 w-6 fill-white"
						>
							<path
								d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
							/>
						</svg>
						<span class="sr-only">Favorites</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</footer>
