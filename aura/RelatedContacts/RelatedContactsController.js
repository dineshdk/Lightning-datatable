({
    doInit : function(component, event, helper) {
        helper.loadColumnData(component, event, helper);
    },
    fromModal: function (component, event, helper) {
        component.set("v.defaultRows", []);
        helper.loadColumnData(component, event, helper);
    },    
    updateSelectedText: function (component, event) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.selectedRowsCount', selectedRows.length);
        component.set('v.selectedRows', selectedRows);
    },
    editWorkOrders: function(component, event, helper) {
        var modalBody;
        var selectedRows = component.get('v.selectedRows');
        $A.createComponent("c:RelatedEditContactsOverlay", { "recordIds" : selectedRows,
                                                             "fromModal": component.getReference("c.fromModal")},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content; 
                                   component.find('overlayLib').showCustomModal({
                                       header: "Contact update",
                                       body: modalBody, 
                                       showCloseButton: true,
                                       cssClass: "slds-modal_small",  
                                       closeCallback: function() {
                                       }
                                   })
                               }                               
                           }); 
    },
    updateColumnSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
    
})