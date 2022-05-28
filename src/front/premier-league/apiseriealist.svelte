<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/seriea"); 
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
		  <h1>API: Serie A Teams Statistics</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="success" on:click={function (){
			window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiserieachart`
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
				<th>Equipo</th>
                <th>Partidos ganados</th>
                <th>Partidos empatados</th>
                <th>Partidos perdidos</th>
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry["Team Name"]}</td>
                    <td>{entry.Win}</td>
					<td>{entry.Draw}</td>
                    <td>{entry.Loss}</td>
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>