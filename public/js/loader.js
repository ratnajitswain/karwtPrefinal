    
    var myVar;

    function newloader() {
      myVar = setTimeout(showPage, 1000);
    }
    
    function showPage() {
      document.getElementById("loader").style.display = "none";
      document.getElementById("loaderpage").style.display = "block";
    }