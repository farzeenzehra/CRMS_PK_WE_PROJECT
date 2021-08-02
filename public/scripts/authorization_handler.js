
if (performance.getEntriesByType("navigation")[0].type == 'back_forward') {
    let IsLoggedIn = false;
    var cookies = document.cookie.split('; ');
   
    cookies.forEach(cookie => {

        var propertyValue = cookie.split('=');
        // console.log('property value ',propertyValue); 
        if(propertyValue[0] == 'IsLoggedIn')
        {
            // alert('fired!!');
            IsLoggedIn = propertyValue[1];
           
        }
    });
    
    // console.log('isloggedin ',IsLoggedIn)

    //development
    // if (IsLoggedIn == 'false'&& window.location.href != 'http://localhost:8081/') {
    //     window.location.href = '/';
    // }
    // else
    // {
    //     window.location.href = window.location.href;
    // }

    
    // deployment
    if (IsLoggedIn == 'false' && window.location.href != window.location.hostname) {
        window.location.href = '/';
    }
    else
    {
        window.location.href = window.location.href;
    }
}

