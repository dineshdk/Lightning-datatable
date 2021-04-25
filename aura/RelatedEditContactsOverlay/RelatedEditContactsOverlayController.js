({
    handleOK : function(component, event, helper) {
        component.find("overlayLib").notifyClose(); 
    },
    
    handleSubmit : function(component, event, helper) {
        helper.toggle(component, event, helper);
        var fields = event.getParam("fields");
        var AccountId = fields.AccountId;     
        var recordIds = component.get("v.recordIds");
        recordIds.forEach(function(record){
            delete record.RecordType;
            delete record.Owner;
            record.AccountId = AccountId;
        });
        var action = component.get("c.updateRelatedContacts");
        action.setParams({
            contact_recs : recordIds
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS'){
                var result = response.getReturnValue(); 
                var evt = component.getEvent('fromModal').fire();
                component.find("overlayLib").notifyClose(); 
                helper.toggle(component, event, helper);
                var msg = "The record has been updated successfully."; 
                if (!$A.util.isUndefinedOrNull(result)) {
                    helper.showToast(component, event, helper, result, 'error');
                }
                else{
                    helper.showToast(component, event, helper, msg, 'success');
                }
            }
            else if (response.getState() === "ERROR") {
                // handle the error state
                helper.toggle(component, event, helper);
                component.find("overlayLib").notifyClose(); 
                console.log('Problem saving case, error: ' + JSON.stringify(response.getError()));
                var errors = response.getError();
                var message = '';
                if (errors) {
                    for(var i=0; i < errors.length; i++) {
                        for(var j=0; errors[i].pageErrors && j < errors[i].pageErrors.length; j++) {
                            message += (message.length > 0 ? '\n' : '') + errors[i].pageErrors[j].message;
                        }
                        if(errors[i].fieldErrors) {
                            for(var fieldError in errors[i].fieldErrors) {
                                var thisFieldError = errors[i].fieldErrors[fieldError];
                                for(var j=0; j < thisFieldError.length; j++) {
                                    message += (message.length > 0 ? '\n' : '') + thisFieldError[j].message;
                                }
                            }
                        }
                        if(errors[i].message) {
                            message += (message.length > 0 ? '\n' : '') + errors[i].message;
                        }
                    }
                } else {
                    message += (message.length > 0 ? '\n' : '') + 'Unknown error';
                }
                helper.showToast(component, event, helper, message, 'error');
            } else {
                helper.toggle(component, event, helper);
                component.find("overlayLib").notifyClose(); 
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                var msg = 'Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error); 
                helper.showToast(component, event, helper, msg, 'error');
            }
        });
        $A.enqueueAction(action);  
    },
    
    
})