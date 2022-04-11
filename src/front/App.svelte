<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	import List from "./tennis/list.svelte";
	import Edit from "./tennis/edit.svelte";

	const routes = {

		"/": Home,
		"/tennis" : List,
		"/tennis/:country/:year" : Edit

	};

</script>

<main>
	<Router {routes} />
</main>
