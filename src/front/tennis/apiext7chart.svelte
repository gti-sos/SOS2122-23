<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let xLabel = [];
    //TENNIS
    let TennisStats = [];
    let stats_mostgrandslams = [];
    let stats_mastersfinals = [];
    let stats_olympicgoldmedals = []; 
    //PublicExpenditure
    let PublicExpenditure = [];
    let public_expenditure_stats = [];
    let pe_to_gdp_stats = [];
    let pe_on_defence_stats = []; 


    async function getData(){
        await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata");
        await fetch("/api/v2/tennis/loadinitialdata");
        
        const PublicExpenditure2 = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/");
        const tennis2 = await fetch("/api/v2/tennis");
        if (PublicExpenditure2.ok && tennis2.ok){
            
            TennisStats = await tennis2.json();
            PublicExpenditure = await PublicExpenditure2.json();
            
            //Tennis
            TennisStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            TennisStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            TennisStats.forEach(element=>{
                stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
                stats_mastersfinals.push(parseFloat(element.masters_finals));
                stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
            });
            //Premier
            PublicExpenditure.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            PublicExpenditure.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            PublicExpenditure.forEach(element=>{
                public_expenditure_stats.push(parseFloat(element.public_expenditure));
                pe_on_defence_stats.push(parseFloat(element.pe_on_defence));
                pe_to_gdp_stats.push(parseFloat(element.pe_to_gdp));
            });
            
            TennisStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            PublicExpenditure.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            await delay(500);
            loadGraph();
        }   
    }
    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'gauge'
            },
            title: {
                text: 'Gráficas conjuntas'
            },
            subtitle: {
                text: 'Integracion Tennis + PublicExpenditure | Tipo: Scatter'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
               // categories: stats_country_date,
               categories: xLabel,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            
            series: [
                //Tennis
                {
                name: 'Grand Slams Ganados',
                data: stats_mostgrandslams
                },
                {
                name: 'Medallas Olimpicas',
                data: stats_olympicgoldmedals
                },
                {
                name: 'Finales de masters',
                data: stats_mastersfinals
                },
                //PremierLeauge
                {
                name: 'Gasto Publico',
                data: public_expenditure_stats
                },
                {
                name: 'PE en Defensa',
                data: pe_on_defence_stats,
                },
                {
                name: 'PE to GDP',
                data: pe_to_gdp_stats
                },
                //NBA
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }
   
    onMount(getData);
    
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
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>

    <Button outline color="secondary" href="/">Volver</Button>
</main>