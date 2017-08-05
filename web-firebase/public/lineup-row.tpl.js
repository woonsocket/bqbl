<tr>
	<td class="mdl-data-table__cell--non-numeric">{{week}}</td>
	{{#each team}}
    <td class="mdl-data-table__cell--non-numeric {{selected}} cell-listener"
	     data-index={{@index}}
	 data-team={{@key}}
    	 data-week={{@root.week}}>{{@key}}</td>
  {{/each}}
</tr>
