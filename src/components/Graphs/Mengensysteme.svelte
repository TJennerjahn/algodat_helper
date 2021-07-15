<script>
    import * as _ from 'lodash';

    import {myGraph} from '../../stores/graphStore';

    console.log('This is the graph:', $myGraph);

    let eingabeMengeString = "";
    $: eingabeMenge = eingabeMengeString.split(",");

    let teilMengenSize = 0;
    let teilMengenListe = [];

    const initTeilMengenListe = (size, list) => {
        
    }

</script>

<h1 class="text-gray-700 text-xl">Eingabemenge: </h1>
<input type="text" bind:value={eingabeMengeString}>