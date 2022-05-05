<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_country_date = [];
    let stats_most_grand_slam = [];
    let stats_masters_finals = [];
    let stats_olympic_gold_medals = [];
    let appearences = [];
    let cleanSheets = [];
    let goals = []; 
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/tennis");
        const res2 = await fetch("/api/v2/premier-league");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_country_date.push(stat.country + "-" + stat.year);
                stats_most_grand_slam.push(stat["most_grand_slam"]);
                stats_masters_finals.push(stat["masters_finals"]);
                stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);             
            });
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
        if(res2.ok){
            const data2 = await res2.json();
            console.log("Estadísticas recibidas 2: "+data2.length);
            //inicializamos los arrays para mostrar los datos
            data2.forEach(stat => {
                stats_country_date.push(stat.country+"-"+stat.year);
                appearences.push(stat["appearences"]);
                cleanSheets.push(stat["cleanSheets"]);
                goals.push(stat["goals"]);            
            });
            //esperamos a que se carguen 
            await delay(500);
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_olympic_gold_medals = new Chart(ctx, {
            type: "line",
            data: {
                labels: stats_country_date,
                datasets: [
                    {
                        label: "Grandslams ganados",
                        backgroundColor: "rgb(0, 128, 128)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_most_grand_slam,
                    },
                    {
                        label: "Masters ganados",
                        backgroundColor: "rgb(255, 0 ,0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_masters_finals,
                    },
                    {
                        label: "Medallas olimpicas",
                        backgroundColor: "rgb(255, 255, 0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: stats_olympic_gold_medals,
                    },                  
                    {
                        label: "Porterias a cero",
                        backgroundColor: "rgb(51, 88, 255)",
                        borderColor: "rgb(255, 255, 255)",
                        data: cleanSheets,
                    },
                    {
                        label: "Goles",
                        backgroundColor: "rgb(51, 255, 91)",
                        borderColor: "rgb(255, 255, 255)",
                        data: goals,
                    },
                    {
                        label: "Apariciones",
                        backgroundColor: "rgb(255, 87, 51)",
                        borderColor: "rgb(255, 255, 255)",
                        data: appearences,
                    },
                ],
            },
            options: {},
        });
       
       
    }
    onMount(getStats);
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <h2>Gráfica Conjunta</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/tennis" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <a href="/#/info" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Volver</a>

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
</style>
