
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode == 46) {
        return true;
    } else if(charCode > 31 && (charCode < 48 || charCode > 57)) {
    	return false;
    }
    return true;
}

function ValidateAlpha(evt)
{	
    var keyCode = (evt.which) ? evt.which : evt.keyCode
    	
    		if (keyCode != 32 && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode >= 123) && keyCode != 32 && keyCode!=8 && keyCode!=46){
       return false;
    }
        return true;
}

function isEmail(evt) {
	    evt = (evt) ? evt : window.event;
	    var charCode = (evt.which) ? evt.which : evt.keyCode;
	    
	    if ((charCode < 48 ||(charCode==58)||(charCode==59)||(charCode==60)||(charCode==61)||(charCode==62)||(charCode==63)||(charCode==64)|| charCode > 90 || charCode == 190)&&(charCode < 95 || charCode >= 123) && charCode != 32 && charCode!=8 && charCode!=46){
	        return false;
	        
	     }
	        return true;
}
