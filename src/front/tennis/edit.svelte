<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';

    let entry = {};

    let updatedCountry;
    let updatedYear;
    let updatedmost_grand_slam;
    let updatedmasters_finals;
    let updatedolympic_gold_medals;

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/tennis/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedmost_grand_slam = entry.most_grand_slam;
            updatedmasters_finals = entry.masters_finals;
            updatedolympic_gold_medals = entry.olympic_gold_medals;
        }else{
            Errores(res.status);
            pop();
        }
    }

    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v1/tennis/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    most_grand_slam: updatedmost_grand_slam,
                    masters_finals: updatedmasters_finals,
                    olympic_gold_medals: updatedolympic_gold_medals
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}); 
    }

    async function Errores(code){
        
        let msg;
        if(code == 404){
            msg = "La entrada seleccionada no existe"
        }
        if(code == 400){
            msg = "La petición no está correctamente formulada"
        }
        if(code == 409){
            msg = "El dato introducido ya existe"
        }
        if(code == 401){
            msg = "No autorizado"
        }
        if(code == 405){
            msg = "Método no permitido"
        }
        window.alert(msg)
            return;
    }

</script>

<main>
    <h1>Editar entrada "{params.country}"/"{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Grand Slams Ganados</th>
                    <th>Masters 1000 Ganados</th>
                    <th>Medallas Olimpicas</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedmost_grand_slam}"></td>
                    <td><input bind:value="{updatedmasters_finals}"></td>
                    <td><input bind:value="{updatedolympic_gold_medals}"></td>
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