<script>    
    import {onMount} from 'svelte';
    import Plotly from 'plotly.js-dist-min';

    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let stats_playerName = [];
    let stats_points = [];
    let stats_playerAge = [];

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/transfer");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
           
            data.forEach(stat => {
                stats_playerName.push(stat["playerName"]);
                stats_points.push(stat["points"]);
                stats_playerAge.push(stat["playerAge"]);
            });
            
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph() {
        var trace_age = {
            x: stats_playerName.slice(0,10),
            y: stats_playerAge,
            type: 'scatter',
            name: 'Edad del jugador'
        };
        var trace_points = {
            x: stats_playerName.slice(0,10),
            y: stats_points,
            type: 'scatter',
            name: 'Puntos del jugador'
        };
       
       
        var dataPlot = [trace_age, trace_points];
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