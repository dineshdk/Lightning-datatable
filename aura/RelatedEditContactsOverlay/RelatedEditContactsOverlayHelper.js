({
    /*  
      This function is invoked for toggling spinner.    
    */
    
    toggle: function (component, event, helper) {
        var spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    
    /*  
      This function is invoked for showing toast message.   
    */
    
    showToast : function(component, event, helper, message, msg_mode) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "message": message,
            "duration":' 15000',
            "type": msg_mode,
            "mode": 'dismissible'
        });
        toastEvent.fire();
    },
})