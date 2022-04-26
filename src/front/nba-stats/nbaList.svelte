<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { Alert } from 'sveltestrap';

	var BASE_API_PATH = "/api/v2/nba-stats";
    let entries = [];
	let newEntry = {
		country: "",
		year: "",
        name: "",
		mostpoints: "",
        fieldgoals: "",
        efficiency: ""
	}

	let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;
 
    let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;

    let maxPages = 0;
	let numEntries;

    onMount(getEntries);
    //GET
    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `/api/v2/nba-stats?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`
		}
        const res = await fetch(cadena); 
        if(res.ok){
			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset*10}`);
			maxPagesFunction(cadenaPag[0]+cadenaPag[1]);
            const data = await res.json();
            entries = data;
			numEntries = entries.length;
            console.log("Received entries: "+entries.length);
        }else{
			Errores(res.status);
		}
    }

    //GET INITIALDATA
    async function LoadEntries() {
 
        console.log("Fetching entry data...");
        await fetch(BASE_API_PATH + "/loadInitialData");
        const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            entries = json;
            visible = true;
            totaldata=6;
            console.log("Received " + entries.length + " entry data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + "No se pudo cargar los datos";
            console.log("ERROR! ");
        }
    }
    //INSERT DATA
    async function insertEntry(){
		 
         console.log("Inserting resources...");
         if (newEntry.country == "" || newEntry.year == null || newEntry.name == "" || 
            newEntry.mostpoints == null || newEntry.fieldgoals == null || newEntry.efficiency == null ) {
             alert("Los campos no pueden estar vacios");
         } else{
             const res = await fetch(BASE_API_PATH,{
                 method:"POST",
                 body:JSON.stringify({
                        country: newEntry.country,
                        year: parseInt(newEntry.year),
                        name: newEntry.name,
                        mostpoints: parseFloat(newEntry.mostpoints),
                        fieldgoals: parseFloat(newEntry.fieldgoals),
                        efficiency: parseFloat(newEntry.efficiency) 
                    }),
                 headers:{
                     "Content-Type": "application/json"
                }
            }).then(function (res) {
                 visible=true;
                if (res.status == 201){
                     getEntries()
                     totaldata++;
                     console.log("Data introduced");
                     color = "success";
                     checkMSG="Entrada introducida correctamente a la base de datos";
                }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     color = "danger";
                     checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                }else if(res.status == 409){
                     console.log("ERROR There is already a data with that country and year in the da tabase");
                     color = "danger";
                     checkMSG= "Ya existe una entrada en la base de datos con el pais y el año introducido";
                }
            });	
        }
    }
    //DELETE STAT
    async function BorrarEntry(countryD, yearD) {
        
        const res = await fetch(BASE_API_PATH+ "/" + countryD + "/" + yearD, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getEntries();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+countryD+" "+yearD+ " borrado correctamente";
                console.log("Deleted " + countryD);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + countryD;
                console.log("Resource NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
            }      
        });
    }
    //DELETE ALL STATS
    async function BorrarEntries() {
		console.log("Deleting entry data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all entry data...");
			const res = await fetch(BASE_API_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getEntries();
                    color = "success";
					checkMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "No se han podido eliminar los datos";
				}
			});
		}
	}
	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
	async function maxPagesFunction(cadena){
		let num;
        const res = await fetch(cadena,
			{
				method: "GET"
			});
			if(res.ok){
				const data = await res.json();
				maxPages = Math.floor(data.length/10);
				if(maxPages === data.length/10){
					maxPages = maxPages-1;
				}
        }
	}
</script>



<main>
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>NBA API</h1>
		</blockquote>
		<p>
		 Estadísticas de jugadores en la mejor liga de baloncesto del mundo
		</p>
	</figure>

	{#await entries}
		loading
	{:then entries}
	
	<Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
		{#if checkMSG}
			{checkMSG}
		{/if}
	</Alert>
    <Table bordered>
		<thead>
			<tr>
				<th>Fecha inicio</th>
				<th>Fecha fin</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="number" min="2000" bind:value="{from}"></td>
				<td><input type="number" min="2000" bind:value="{to}"></td>
				<td align="center"><Button outline color="dark" on:click="{()=>{
					if (from == null || to == null) {
						window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
					}else{
                        checkMSG = "Datos cargados correctamente en ese periodo";
						getEntries();
					}
				}}">
					Buscar
					</Button>
				</td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = null;
					to = null;
					getEntries();
                    checkMSG = "Busqueda limpiada";
					
				}}">
					Limpiar Búsqueda
                    
					</Button>
                    
				</td>
			</tr>
		</tbody>
	</Table>
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>País</th>
				<th>Año</th>
				<th>Nombre</th>
				<th>Puntos</th>
                <th>Tiros de campo</th>
                <th>Eficiencia</th>
				<th></th>
				<th> </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newEntry.country}"></td>
				<td><input bind:value="{newEntry.year}"></td>
                <td><input bind:value="{newEntry.name}"></td>
				<td><input bind:value="{newEntry.mostpoints}"></td>
                <td><input bind:value="{newEntry.fieldgoals}"></td>
                <td><input bind:value="{newEntry.efficiency}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.country}</td>
					<td>{entry.year}</td>
                    <td>{entry.name}</td>
					<td>{entry.mostpoints}</td>
                    <td>{entry.fieldgoals}</td>
                    <td>{entry.efficiency}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/nba-stats/${entry.country}/${entry.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadEntries}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarEntries}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
    <div align="center">
		{#each Array(maxPages+1) as _,page}
		
			<Button outline color="secondary" on:click={()=>{
				offset = page;
				getEntries();
			}}>{page} </Button>&nbsp
	
		{/each}
	</div>
{/await}

</main>