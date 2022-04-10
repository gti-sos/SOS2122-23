<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	
	const routes = {

		"/": Home
	};

</script>

<main>
	<Router {routes} />
</main>
