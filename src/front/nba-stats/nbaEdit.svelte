<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import { Alert } from 'sveltestrap';

    let visible = false;
    let color = "danger";


    let entry = {};
    let updatedCountry;
    let updatedYear;
    let updatedName;
    let updatedMostpoints;
    let updatedFieldgoals;
    let updatedEfficiency;
    let errorMsg = "";

    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/nba-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedName = entry.name;
            updatedMostpoints = entry.mostpoints;
            updatedFieldgoals = entry.fieldgoals;
            updatedEfficiency = entry.efficiency;
        }else{
            visible = true;
            color = "danger"
            errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country +" " + params.year;
            console.log("ERROR" + errorMsg);
        }
    }
    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/nba-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: parseInt(updatedYear),
                    name: updatedName,
                    mostpoints: parseFloat(updatedMostpoints),
                    fieldgoals: parseFloat(updatedFieldgoals),
                    efficiency: parseFloat(updatedEfficiency)
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
                    visible = true;
                    if(res.status == 200){
                        getEntries(); 
                        console.log("Data introduced");
                        color = "success";
                        errorMsg="Recurso actualizado correctamente";
                    }else{
                        console.log("Data not edited");
                        color = "danger";
                        errorMsg= "Compruebe los campos";
                    }
                });	
    }
</script>

<main>
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMsg}
		    {errorMsg}
	    {/if}
    </Alert>

    <h1>Editar entrada "{params.country}","{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        
    
        <Table bordered>
            <thead>
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
                    <td><input bind:value="{updatedCountry}"></td>
                    <td><input bind:value = "{updatedYear}"></td>
                    <td><input bind:value = "{updatedName}"></td>
                    <td><input bind:value="{updatedMostpoints}"></td>
                    <td><input bind:value="{updatedFieldgoals}"></td>
                    <td><input bind:value="{updatedEfficiency}"></td>
                    <td><Button outline color="primary" on:click="{EditEntry}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

</main>