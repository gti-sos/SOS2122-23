<script>    
    import {onMount} from 'svelte';
    import Plotly from 'plotly.js-dist-min';

    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let stats_teamName = [];
    let stats_wins = [];
    let stats_draws = [];
    let stats_loss = [];

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/seriea");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
           
            data.forEach(stat => {
                stats_teamName.push(stat["Team Name"]);
                stats_wins.push(stat["Win"]);
                stats_draws.push(stat["Draw"]);
                stats_loss.push(stat["Loss"]);
            });
            
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph() {
       
        var trace_wins = {
            x: stats_teamName.slice(1,10),
            y: stats_wins,
            type: 'scatter',
            name: 'Partidos Ganados'
        };
        var trace_draws = {
            x: stats_teamName.slice(1,10),
            y: stats_draws,
            type: 'scatter',
            name: 'Partidos Empatados'
        };
        var trace_loss = {
            x: stats_teamName.slice(1,10),
            y: stats_loss,
            type: 'scatter',
            name: 'Partidos Perdidos'
        };
       
       
        var dataPlot = [trace_wins, trace_draws, trace_loss];
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