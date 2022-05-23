<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";

	import List from "./tennis/list.svelte";
	import Edit from "./tennis/edit.svelte";
	import Chart from "./tennis/chart.svelte";
	import Chart2 from "./tennis/chart2.svelte";
	import Twitch from "./tennis/twitch.svelte";
	import TwitchChart from "./tennis/twitchchart.svelte";
	import ApitennisList from "./tennis/apitennislist.svelte";
	import ApitennisChart from "./tennis/apitennislistchart.svelte";
	import apiext3list from "./tennis/apiext3list.svelte";
	import apiext3chart from "./tennis/apiext3chart.svelte";
	import apiext4list from "./tennis/apiext4list.svelte";
	import apiext4chart from "./tennis/apiext4chart.svelte";

	import Info from "./Info.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";
	import GroupGraph from "./GroupGraph.svelte";

	import Premier from "./premier-league/premier.svelte";
	import PremierEdit from "./premier-league/premierEdit.svelte";
	import PremierChart from "./premier-league/premierCharts.svelte";
	import apiext1list from "./premier-league/apiext1list.svelte";
	import apiext1chart from "./premier-league/apiext1chart.svelte";
	import apiext2list from "./premier-league/apiext2list.svelte";
	import apiext2chart from "./premier-league/apiext2chart.svelte";
	
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
		"/tennis/chart2" : Chart2,
		"/tennis/twitch" : Twitch,
		"/tennis/twitchchart" : TwitchChart,
		"/tennis/apitennislist": ApitennisList,
		"/tennis/apitennischart": ApitennisChart,
		"/tennis/apiext3list": apiext3list,
		"/tennis/apiext3chart": apiext3chart,
		"/tennis/apiext4list": apiext4list,
		"/tennis/apiext4chart": apiext4chart,
		
		"/premier-league" : Premier,
		"/premier-league/:country/:year": PremierEdit,
		"/premier-league/charts" : PremierChart,
		"/premier-league/apiext1list": apiext1list,
		"/premier-league/apiext1chart": apiext1chart,
		"/premier-league/apiext2list": apiext2list,
		"/premier-league/apiext2chart": apiext2chart,
		
		"/nba-stats" : NbaList,
		"/nba-stats/:country/:year": NbaEdit
		
		

	};


</script>

<Header />

<main>
	<Router {routes} />
</main>

<Footer />