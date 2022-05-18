<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";

	import List from "./tennis/list.svelte";
	import Edit from "./tennis/edit.svelte";
	import Chart from "./tennis/chart.svelte";
	import Twitch from "./tennis/twitch.svelte";
	import TwitchChart from "./tennis/twitchchart.svelte";
	import ApitennisList from "./tennis/apitennislist.svelte";
	import ApitennisChart from "./tennis/apitennislistchart.svelte";

	import Info from "./Info.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";
	import GroupGraph from "./GroupGraph.svelte";

	import Premier from "./premier-league/premier.svelte";
	import PremierEdit from "./premier-league/premierEdit.svelte";
	import PremierChart from "./premier-league/premierCharts.svelte";
	
	import NbaList from "./nba-stats/nbaList.svelte";
	import NbaEdit from "./nba-stats/nbaEdit.svelte";

	import Analytics from "./Analytics.svelte";
	import About from "./About.svelte";
	import Integrations from "./Integrations.svelte";

	

	const routes = {

		"/": Home,

		"/groupgraph" : GroupGraph,
		"/info" : Info,
		"/about" : About,
		"/analytics" : Analytics,
		"/integrations" : Integrations,

		"/tennis" : List,
		"/tennis/:country/:year" : Edit,
		"/tennis/chart" : Chart,
		"/tennis/twitch" : Twitch,
		"/tennis/twitchchart" : TwitchChart,
		"/tennis/apitennislist": ApitennisList,
		"/tennis/apitennischart": ApitennisChart,
		
		"/premier-league" : Premier,
		"/premier-league/:country/:year": PremierEdit,
		"/premier-league/charts" : PremierChart,
		
		"/nba-stats" : NbaList,
		"/nba-stats/:country/:year": NbaEdit
		
		

	};


</script>

<Header />

<main>
	<Router {routes} />
</main>

<Footer />