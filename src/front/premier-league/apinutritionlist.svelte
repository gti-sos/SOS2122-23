<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/food"); 
        if(res.ok){
			const data = await res.json();
			console.log(data);
            entries = data;
			console.log(entries);
			console.log("Received entries: "+ entries.length);
        }
    }
</script>



<main>

	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>API: Nutrition</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="success" on:click={function (){
			window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/nutritionchart`
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
				
                <th>Nombre comida</th>
				<th>Fecha Publicación</th>
				<th>Mercado del País</th>
                
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.description}</td>
					<td>{entry.publicationDate}</td>
					<td>{entry.marketCountry}</td>
					
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>