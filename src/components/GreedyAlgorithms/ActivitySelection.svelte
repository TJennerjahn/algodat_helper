<script>
    import * as _ from 'lodash';
    import dayjs from 'dayjs';
    import customParseFormat from 'dayjs/plugin/customParseFormat';
    import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

    dayjs.extend(customParseFormat);
    dayjs.extend(isSameOrAfter);

    let activities = [];
    let newActivity = {
        name: "",
        start: "",
        end: "",
    }

    const selection = (input) => {
        let workingCopy = _.cloneDeep(input);
        let result = [];

        while(workingCopy.length > 0) {
            workingCopy.sort((a, b) => (a.end.isAfter(b.end) ? 1 : -1));

            let equalActivities = workingCopy.filter(el => el.end.isSame(workingCopy[0].end));
            equalActivities.sort((a,b) => a.name.localeCompare(b.name));

            result.push(equalActivities[0]);
            let index = workingCopy.findIndex(el => el === equalActivities[0]);
            workingCopy.splice(index, 1);

            workingCopy = workingCopy.filter(el => el.start.isSameOrAfter(result[result.length - 1].end));
        }
        

        console.log(result);
        return result;
    }

    $: selectedActivities = selection(activities);
</script>



<table>
    <tr>
        <th>Activity</th>
        <th>Start</th>
        <th>Ende</th>
        <th></th>
    </tr>

    {#each activities as activity, i}
        <tr>
            <td>{activity.name}</td>
            <td>{dayjs(activity.start).format('HH:mm')}</td>
            <td>{dayjs(activity.end).format('HH:mm')}</td>
            <button class="bg-red-500 text-white rounded-md" on:click={() => {
                activities.splice(i, 1);
                activities = activities;
            }}>Loeschen</button>
        </tr>
    {/each}

    <tr>
        <td>
            <input type="text" bind:value={newActivity.name}>
        </td>
        <td>
            <input type="text" bind:value={newActivity.start}>
        </td>
        <td>
            <input type="text" bind:value={newActivity.end}>
        </td>

        <td>
            <button class="bg-gray-700 text-white px-1 py-1 rounded-md my-2" on:click={() => {
                activities.push({name: newActivity.name, start: dayjs(newActivity.start, ['HH:mm', 'HH']), end: dayjs(newActivity.end, ['HH:mm', 'HH'])});
                activities = activities;
                console.log(activities);
            }}>Hinzufuegen</button>
        </td>
    </tr>

    <h1 class="text-3xl text-gray-700">Selection:</h1>
    <p>{selectedActivities.map(doc => doc.name).toString()}</p>

</table>