function year() {
        
    // Creating Date Object 
    var date = new Date();
    
    // Year from the above object 
    // is being fetched using getFullYear() 
    var dateObject = date.getFullYear();
    
    // Printing current year 
    document.getElementById("year").innerHTML = 
    `&copy; ${dateObject} | Nayade De la cruz | Washington`;
}

function lastModified (){
    let oLastModif = new Date(document.lastModified);
    document.getElementById('lastModified').innerHTML = `Last Modification: ${oLastModif}`;
}
year();
lastModified();