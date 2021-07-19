<script>
  import * as _ from "lodash";
  import cloneDeep from "lodash/cloneDeep";

  let selectedOrders = [];

  let orders = [];
  let newOrder = {
    name: "",
    value: 0,
    deadline: 0,
  };

  // selection function that returns a list of selected orders, selected by their values and deadline
  const selection = (orderList) => {
    let list = _.cloneDeep(orderList);
    list.sort((a, b) => b.value - a.value);
    let selected = [];
    for (let i = 0; i < list.length; i++) {
      selected.push(list[i]);
      for (let j = 0; j < list.length; j++) {
        if (
          selected.filter((x) => x.deadline <= list[j].deadline).length >
          list[j].deadline
        ) {
          selected.pop();
          break;
        }
      }
    }

    return selected;
  };

  $: selectedOrders = selection(orders);
</script>

<table class="w-1/3">
  <tr>
    <th>Order</th>
    <th>Value</th>
    <th>Deadline</th>
    <th />
  </tr>

  {#each orders as order, i}
    <tr>
      <td>{order.name}</td>
      <td>{order.value}</td>
      <td>{order.deadline}</td>
      <td>
        <button
          class="bg-red-500 text-white rounded-md p-2"
          on:click={() => {
            orders.splice(i, 1);
            orders = orders;
          }}
        >
          Loeschen
        </button>
      </td>
    </tr>
  {/each}
  <tr>
    <td>
      <input type="text" bind:value={newOrder.name} />
    </td>
    <td>
      <input type="number" bind:value={newOrder.value} />
    </td>
    <td>
      <input type="number" bind:value={newOrder.deadline} />
    </td>
    <td>
      <button
        class="bg-gray-700 text-white px-1 py-1 rounded-md my-2"
        on:click={() => {
          orders = [...orders, _.cloneDeep(newOrder)];
        }}
      >
        Hinzufuegen
      </button>
    </td>
  </tr>
</table>

<p>{selectedOrders.map((x) => x.name).join(", ")} = {selectedOrders.map(x => x.value).reduce((a, b) => a + b, 0)}</p>
