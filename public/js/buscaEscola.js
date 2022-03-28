function buscaEscola() {
  // Declare variables
  let input, filter, table, rows, cell, index, strValue;

  input = document.getElementById("busca");
  filter = input.value.toUpperCase();
  table = document.getElementById("escolas");
  rows = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (index = 1; index < rows.length; index++) {
    cell = rows[index].getElementsByTagName("td")[1];
    if (cell) {
      strValue = cell.textContent || cell.innerText;

      if (strValue.toUpperCase().indexOf(filter) > -1) {
        rows[index].style.display = "";
      } else {
        rows[index].style.display = "none";
      }
    }
  }
}
