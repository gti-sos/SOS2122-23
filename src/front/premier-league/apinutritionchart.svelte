<script>    
    import {onMount} from 'svelte';
    import Plotly from 'plotly.js-dist-min';

    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let stats_description = [];
    let stats_publicationDate = [];
    let stats_marketCountry = [];

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/food");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
           
            data.forEach(stat => {
                stats_description.push(stat["description"]);
                stats_publicationDate.push(stat["publicationDate"]);
                stats_marketCountry.push(stat["marketCountry"]);
            });
            
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph() {
        var trace_description = {
            x: stats_publicationDate,
            y: stats_description,
            type: 'bar',
            name: 'Nombre comida'
        };
        var trace_marketCountry = {
            x: stats_publicationDate,
            y: stats_marketCountry,
            type: 'bar',
            name: 'País del mercado'
        };
       
       
        var dataPlot = [trace_description, trace_marketCountry];
        Plotly.newPlot('myDiv', dataPlot);
    }

    onMount(getPEStats);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <h2>Nutricion</h2>
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