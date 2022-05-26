<script>    
    import {onMount} from 'svelte';
    import Plotly from 'plotly.js-dist-min';

    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let stats_comida
    let stats_grasas = [];
    let stats_carbohidratos = [];
    let stats_proteinas = [];

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/food");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
           
            data.forEach(stat => {
                stats_comida.push(stat.description);
                stats_grasas.push(stat.fat["value"]);
                stats_carbohidratos.push(stat.carbohydrates["value"]);
                stats_proteinas.push(stat.protein["value"]);
            });
            
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph() {
        var trace_fat = {
            x: stats_comida,
            y: stats_grasas,
            type: 'bar',
            name: 'Grasas'
        };
        var trace_carbohydrates = {
            x: stats_comida,
            y: stats_carbohidratos,
            type: 'bar',
            name: 'Carbohidratos'
        };
        var trace_protein = {
            x: stats_comida,
            y: stats_proteinas,
            type: 'bar',
            name: 'Proteinas'
        };
       
       
        var dataPlot = [trace_fat, trace_carbohydrates, trace_protein];
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