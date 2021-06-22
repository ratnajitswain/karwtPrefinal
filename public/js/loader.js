    
    var myVar;

    function newloader() {
        $('.right-bar').hide()
$("#light-mode-switch").click()
$("#light-mode-switch").prop('checked')
      myVar = setTimeout(showPage, 1000);
    }
    
    function showPage() {
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderpage").style.display = "block";
    }