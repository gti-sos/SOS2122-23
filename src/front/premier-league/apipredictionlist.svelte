<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/pred"); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
</script>



<main>

	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>API: Premier League Predictions</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="success" on:click={function (){
			window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apipredictionchart`
		}}>
			Gráfica
		</Button>
	</td>
{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Equipo local</th>
				<th>Apuesta</th>
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.home_team}</td>
					<td>{entry.odds[1]}</td>
	
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>