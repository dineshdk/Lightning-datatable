import { LightningElement,wire,track,api } from 'lwc';
import getRelatedContacts from '@salesforce/apex/RelatedContactsController.getRelatedContacts';
import { NavigationMixin} from 'lightning/navigation';


export default class DataTable extends NavigationMixin(LightningElement) {
    @api recordId;
    @track data;
    @track openQuickAction;
    @track accountName;
    @track ownerName;
    @track fieldSupportName;
    @track woList = [];  
    @track FieldSupport_Name;
    @track isModalOpen = false;
    @track sortBy;
    @track sortDirection;
    @api selectedData = [];
    @track getSelected;
    @track selectedrecordIds; 
    @track selectedIds = []; 
    @track hasRendered = true;
    @track columns =[
        {label: 'Name', fieldName: 'linkID', type: 'url', sortable: true,
         typeAttributes: {label: { fieldName: 'Name', sortable: true }, }},
        {label: 'Email', fieldName: 'Email', type: 'text', sortable: true},
        {label: 'Owner Name', fieldName: 'OwnerName', type: 'text', sortable: true}
    ];


    renderedCallback(){
        if(this.hasRendered){

            getRelatedContacts({recordId: this.recordId })
        .then(data=>{

            if (data) {  
                var tempWoList = [];  
                 //let tempRecord = Object.assign({}, data[i]); //cloning object 
                tempWoList = data;
                tempWoList.forEach(function(record){
                    record.linkID = '/'+record.Id;
                    if(record.Owner)     
                        record.OwnerName = record.Owner["Name"];
                });
                this.woList = tempWoList;  
                this.error = undefined;                                
                this.hasRendered = false;
            }
        }).catch(error=>{console.log('Error'+error.body.message)});
        }
    }
    openModal() {
        // to open modal set isModalOpen tarck value as true
        debugger;
        this.selectedrecordIds = this.template.querySelector('lightning-datatable').getSelectedRows();
        this.openQuickAction = true;
        this.isModalOpen = true; 
    }
    closeModal(event) {
        // to close modal set isModalOpen tarck value as false
        this.selectedIds = [];
        this.isModalOpen = false;
        this.openQuickAction = false;
        this.hasRendered = true;
    }
        


    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.woList));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.woList = parseData;

    }
        
}