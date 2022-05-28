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
	import apiext5list from "./tennis/apiext5list.svelte";
	import apiext5chart from "./tennis/apiext5chart.svelte";
	import apiext6chart from "./tennis/apiext6chart.svelte";
	import apiext7chart from "./tennis/apiext7chart.svelte";
	
	import Info from "./Info.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";
	import GroupGraph from "./GroupGraph.svelte";

	import Premier from "./premier-league/premier.svelte";
	import PremierEdit from "./premier-league/premierEdit.svelte";
	import PremierChart from "./premier-league/premierCharts.svelte";
	import PremierChart2 from "./premier-league/premierCharts2.svelte";
	import apiext1list from "./premier-league/apiext1list.svelte";
	import apiext1chart from "./premier-league/apiext1chart.svelte";
	import apiext2list from "./premier-league/apiext2list.svelte";
	import apiext2chart from "./premier-league/apiext2chart.svelte";
	import apipredictionlist from "./premier-league/apipredictionlist.svelte";
	import apipredictionchart from "./premier-league/apipredictionchart.svelte";
	import apinutritionlist from "./premier-league/apinutritionlist.svelte";
	import apinutritionchart from "./premier-league/apinutritionchart.svelte";
	import apitransferlist from "./premier-league/apitransferlist.svelte";
	import apitransferchart from "./premier-league/apitransferchart.svelte";
	import apiseriealist from "./premier-league/apiseriealist.svelte";
	import apiserieachart from "./premier-league/apiserieachart.svelte";
	
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
		"/tennis/apiext5list": apiext5list,
		"/tennis/apiext5chart": apiext5chart,
		"/tennis/apiext6chart": apiext6chart,
		"/tennis/apiext7chart": apiext7chart,
		
		"/premier-league" : Premier,
		"/premier-league/:country/:year": PremierEdit,
		"/premier-league/charts" : PremierChart,
		"/premier-league/charts2" : PremierChart2,
		"/premier-league/apiext1list": apiext1list,
		"/premier-league/apiext1chart": apiext1chart,
		"/premier-league/apiext2list": apiext2list,
		"/premier-league/apiext2chart": apiext2chart,
		"/premier-league/apipredictionlist" : apipredictionlist,
		"/premier-league/apipredictionchart" : apipredictionchart,
		"/premier-league/apinutritionlist" : apinutritionlist,
		"/premier-league/apinutritionchart" : apinutritionchart,
		"/premier-league/apitransferlist" : apitransferlist,
		"/premier-league/apitransferchart" : apitransferchart,
		"/premier-league/apiseriealist" : apiseriealist,
		"/premier-league/apiserieachart" : apiserieachart,
		
		"/nba-stats" : NbaList,
		"/nba-stats/:country/:year": NbaEdit
		
		

	};


</script>

<Header />

<main>
	<Router {routes} />
</main>

<Footer />