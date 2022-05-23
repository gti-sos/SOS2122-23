<script>
    import { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let entries = [];
    onMount(getEntries);

    async function getEntries() {
        const res1 = await fetch(
            "https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats/loadInitialData"
        );
        if (res1.ok) {
            console.log("Fetching entries....");
            const res = await fetch(
                "https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats"
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
            <h1>API: defense-spent-stats</h1>
        </blockquote>
    </figure>
    <td align="center">
        <Button
            color="success"
            on:click={function () {
                window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext2chart`;
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
                    <th>Gasto en millones</th>
                    <th>% gasto público</th>
                    <th>% PIB</th>
                    <th>Per capita</th>
                    <th>Var</th>
                </tr>
            </thead>
            <tbody>
                <tr />
                {#each entries as entry}
                    <tr>
                        <td>{entry.country}</td>
                        <td>{entry.year}</td>
                        <td>{entry.spen_mill_eur}</td>
                        <td>{entry.public_percent}</td>
                        <td>{entry.pib_percent}</td>
                        <td>{entry.per_capita}</td>
                        <td>{entry.var}</td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    {/await}
</main>
