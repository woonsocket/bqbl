<table class="mdl-data-table mdl-js-data-table">
	 <thead></thead>
	 <tbody id=page_content>
  {{#each week}}
	 <tr>
		 <td class="mdl-data-table__cell--non-numeric">{{week}}</td>
		 {{#each team}}
	     <td class="mdl-data-table__cell--non-numeric {{selected}} cell-listener"
	       data-index={{@index}}
	       data-team={{@key}}
		     data-week={{../week}}>{{@key}}</td>
	     {{/each}}
		 </tr>
    {{/each}}
	</tbody>
</table>
