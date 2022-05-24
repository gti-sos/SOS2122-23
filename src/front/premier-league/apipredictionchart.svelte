<script>    
    import {onMount} from 'svelte';
    import Plotly from 'plotly.js-dist-min';

    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let stats_home_team = [];
    let stats_odds = [];

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/pred");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
           
            data.forEach(stat => {
                stats_home_team.push(stat["home_team"]);
                stats_odds.push(stat.odds["1"]);
            });
            
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph() {
        var trace_appearences = {
            x: stats_home_team.slice(0,10),
            y: stats_odds.slice(0,10),
            type: 'bar',
            name: 'Apariciones'
        };
       
       
        var dataPlot = [trace_appearences];
        Plotly.newPlot('myDiv', dataPlot);
    }

    onMount(getPEStats);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <h2>Predicciones</h2>
    <h4>Biblioteca: Plotly</h4>
    <div id='myDiv'><!-- Plotly chart will be drawn inside this DIV --></div>
    <a href="/#/integrations" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Volver</a>
</main>

<style>
    h2{
        text-align: center;
    }
    h4{
        text-align: center;
    }
</style>