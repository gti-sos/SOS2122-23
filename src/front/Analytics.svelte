<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
  
    const delay = ms => new Promise(res => setTimeout(res,ms));
    //Tennis
    let tennisData = [];
    let tennisChartCountryYear = [];
    let tennisChartmost_grand_slam = [];
    let tennisChartmasters_finals = [];
    let tennisChartolympic_gold_medals = []; 
    //Premier
    let premierStats = [];
    let premier_country_year = [];
    let premier_appearences = [];
    let premier_cleanSheets = [];
    let premier_goals = [];
    //Nba
    let nbaStats = [];
    let nba_country_year = [];
    let nba_mostpoints = [];
    let nba_fieldgoals = [];
    let nba_efficiency = [];

    async function gettennisData(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/tennis");
        if(res.ok){
            const data = await res.json();
            tennisData = data;
            console.log("Estadísticas recibidas: "+tennisData.length);
            //inicializamos los arrays para mostrar los datos
            tennisData.forEach(stat => {
                //tennisChartCountryYear.push(stat.country+"-"+stat.year);
                tennisChartCountryYear.push(stat.year);
                tennisChartmost_grand_slam.push(parseFloat(stat.most_grand_slam));
                tennisChartolympic_gold_medals.push(parseFloat(stat.olympic_gold_medals));
                tennisChartmasters_finals.push(parseFloat(stat.masters_finals));            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
    }
    }
    async function getpremierStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/premier-league");
        if(res.ok){
            const data = await res.json();
            premierStats = data;
            console.log("Estadísticas recibidas: "+premierStats.length);
            //inicializamos los arrays para mostrar los datos
            premierStats.forEach(stat => {
                premier_country_year.push(stat.country+"-"+stat.year);
                premier_appearences.push(parseFloat(stat.appearences));
                premier_cleanSheets.push(parseFloat(stat.cleanSheets));
                premier_goals.push(parseFloat(stat.goals));            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
        }
    }
    async function getnbaStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/nba-stats");
        if(res.ok){
            const data = await res.json();
            nbaStats = data;
            console.log("Estadísticas recibidas: "+nbaStats.length);
            //inicializamos los arrays para mostrar los datos
            nbaStats.forEach(stat => {
                nba_country_year.push(stat.country+"-"+stat.year);
                nba_mostpoints.push(parseFloat(stat.mostpoints));
                nba_fieldgoals.push(parseFloat(stat.fieldgoals));
                nba_efficiency.push(parseFloat(stat.efficiency));            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
        }
    }
    
    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Grafica conjunta grupo 23'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "Year",
                },
                categories: tennisChartCountryYear,
            },
            /*
            xAxis: {
                title: {
                    text: "Country-Year",
                },
                categories: premier_country_year,
            },
            */
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            
            series: [
                {
                name: 'most_grandslams',
                data: tennisChartmost_grand_slam
                },
                {
                name: 'olympic_gold_medals',
                data: tennisChartolympic_gold_medals
                },
                {
                name: 'masters_finals',
                data: tennisChartmasters_finals
                },
                //premier STATS
                {
                name: 'partidos jugados',
                data: premier_appearences
                },
                {
                name: 'portería vacía',
                data: premier_cleanSheets,
                },
                {
                name: 'goles',
                data: premier_goals
                },
                //nba-stats
                {
                    name: 'mostpoints',
                    data: nba_mostpoints
                },
                {
                    name: 'fieldgoals',
                    data: nba_fieldgoals
                },
                {
                    name: 'efficiency',
                    data: nba_efficiency
                }
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
    onMount(gettennisData);
    onMount(getpremierStats);
    onMount(getnbaStats);
    
  </script>
  
  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>    
  </svelte:head>
  
  <main>
  
  
    
  
    <div>
        <h2>
            Visualizacion conjunta SOS2122-23
        </h2>
    </div>
  
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>
  
    <Button outline color="secondary" href="/">Volver</Button>
  </main>
  
  <style>
    main {
        text-align: center;
        padding: 30px;       
    }
    p.error{
      color: red; 
      text-align:center;
      font-size: 20px;
      margin-top:80px;
    }
    
   
  </style>