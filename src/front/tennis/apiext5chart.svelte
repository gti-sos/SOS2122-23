<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats = [];
    let stats_teamname = [];
    let stats_points = [];

    async function getTennisWomen() {
        console.log("Fetching stats....");
      
        
            const res = await fetch(
                "/api/v1/apiext5/"
            );
            if (res.ok) {
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: " + stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach((stat) => {
                    stats_teamname.push(stat.team["name"]);
                    stats_points.push(stat["points"]);
                
                });
                //esperamos para que se carrguen los datos
                await delay(500);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        
    }
    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "spline",
            },
            title: {
                text: "Ranking Tennis Femenino",
            },
            subtitle: {
                text: "API Integrada 5 | Tipo: Spline",
            },
            yAxis: {
                title: {
                    text: "Valor",
                },
            },
            xAxis: {
                title: {
                    text: "Tenista",
                },
                categories: stats_teamname.slice(0, 10),
            },
            plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
           
        }
    },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
            },

            series: [
                {
                    name: "Puntos",
                    data: stats_points.slice(0, 10),
                },
            ],
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            legend: {
                                layout: "horizontal",
                                align: "center",
                                verticalAlign: "bottom",
                            },
                        },
                    },
                ],
            },
        });
    }
    onMount(getTennisWomen);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
</main>
