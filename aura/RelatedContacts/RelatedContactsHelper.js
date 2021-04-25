({
    loadColumnData : function (component, event, helper) {
        component.set('v.columns', [
            {label: 'Name', fieldName: 'linkID', type: 'url', sortable: true,
             typeAttributes: {label: { fieldName: 'Name', sortable: true }, }},
            {label: 'Email', fieldName: 'Email', type: 'text', sortable: true},
            {label: 'Owner Name', fieldName: 'OwnerName', type: 'text', sortable: true}
        ]);
        var action = component.get("c.getRelatedContacts");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS'){
                var result = response.getReturnValue(); 
                result.forEach(function(record){
                    record.linkID = '/'+record.Id;
                    if(!$A.util.isUndefinedOrNull(record.Owner))     
                        record.OwnerName = record.Owner["Name"];
                });
                component.set("v.data", result);
                this.sortData(component, component.get("v.sortedBy"), component.get("v.sortedDirection"));
            }
        });
        $A.enqueueAction(action);  
    },
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
            "duration":' 5000',
            "type": msg_mode,
            "mode": 'dismissible'
        });
        toastEvent.fire();
    },
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.data");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse));
        cmp.set("v.data", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
})