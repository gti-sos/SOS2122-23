<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let entries = [];
    onMount(getEntries);

    async function getEntries() {
        const res1 = await fetch(
            "https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/loadInitialData"
        );
        if (res1.ok) {
            console.log("Fetching entries....");
            const res = await fetch(
                "https://sos2122-21.herokuapp.com/api/v1/productions-vehicles"
            );
            if (res.ok) {
                const data = await res.json();
                entries = data;
                console.log("Received entries: " + entries.length);
            }
        }
    }
</script>

<main>
    <figure class="text-center">
        <blockquote class="blockquote">
            <h1>API: productions-vehicles</h1>
        </blockquote>
    </figure>
    <td align="center">
        <Button
            color="success"
            on:click={function () {
                window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext1chart`;
            }}
        >
            Gráfica
        </Button>
    </td>
    {#await entries}
        loading
    {:then entries}
        <Table bordered>
            <thead id="titulitos">
                <tr>
                    <th>Country</th>
                    <th>Year</th>
                    <th>Vehículos comerciales</th>
                    <th>Vehículos pasajeros</th>
                    <th>Producción anual de vehículos</th>
                </tr>
            </thead>
            <tbody>
                <tr />
                {#each entries as entry}
                    <tr>
                        <td>{entry.country}</td>
                        <td>{entry.year}</td>
                        <td>{entry.veh_comm}</td>
                        <td>{entry.veh_pass}</td>
                        <td>{entry.veh_annprod}</td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    {/await}
</main>
