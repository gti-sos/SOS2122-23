<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	import List from "./tennis/list.svelte";
	import Edit from "./tennis/edit.svelte";

	import Info from "./Info.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";

	import Premier from "./premier-league/premier.svelte";
	import PremierEdit from "./premier-league/premierEdit.svelte";

	const routes = {

		"/": Home,
		"/tennis" : List,
		"/tennis/:country/:year" : Edit,
		"/premier-league" : Premier,
		"/premier-league/:country/:year": PremierEdit,
		"/info" : Info

	};


</script>

<Header />

<main>
	<Router {routes} />
</main>

<Footer />