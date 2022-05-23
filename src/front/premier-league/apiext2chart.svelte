<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats = [];
    let stats_country_date = [];
    let stats_spen_mill_eur = [];
    let stats_public_percent = [];
    let stats_pib_percent = [];
    let stats_per_capita = [];
    let stats_var = [];
    async function getPEStats() {
        console.log("Fetching stats....");
        const res1 = await fetch(
            "https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats/loadInitialData"
        );
        if (res1.ok) {
            const res = await fetch(
                "https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats"
            );
            if (res.ok) {
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: " + stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach((stat) => {
                    stats_country_date.push(stat.country + "-" + stat.year);
                    stats_spen_mill_eur.push(stat["spen_mill_eur"]);
                    stats_public_percent.push(stat["public_percent"]);
                    stats_pib_percent.push(stat["pib_percent"]);
                    stats_per_capita.push(stat["per_capita"]);
                    stats_var.push(stat["var"]);
                });
                //esperamos para que se carrguen los datos
                await delay(500);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        }
    }
    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "column",
            },
            title: {
                text: "Estadísticas de defensa",
            },
            subtitle: {
                text: "API Integrada 2",
            },
            yAxis: {
                title: {
                    text: "Valor",
                },
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_date,
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
            },

            series: [
                {
                    name: "Gasto en millones",
                    data: stats_spen_mill_eur,
                },
                {
                    name: "% gasto público",
                    data: stats_public_percent,
                },
                {
                    name: "%PIB",
                    data: stats_pib_percent,
                },
                {
                    name: "Per capita",
                    data: stats_per_capita,
                },
                {
                    name: "Var",
                    data: stats_var,
                }
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
    onMount(getPEStats);
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
