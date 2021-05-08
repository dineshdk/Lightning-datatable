import { LightningElement,wire,track,api  } from 'lwc';
import updateRelatedContacts from '@salesforce/apex/RelatedContactsController.updateRelatedContacts';
import {refreshApex} from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class DisplayDatatableRecord extends LightningElement {

    @api selectedrecordIds;
    @api selectedRecords = new Object();
    @api record;
    @track loadingupdate= true;
    submitDetails(event) {
        this.loadingupdate=false;
        this.record = event.detail;
        let selectedRec = JSON.parse(JSON.stringify(this.selectedRecords));
        selectedRec.forEach(function(record){
            delete record.RecordType;
            delete record.Owner;
            record.AccountId = event.detail.fields['AccountId'];
        });
        console.log('selectedRec==>'+selectedRec);  
        updateRelatedContacts({contact_recs:selectedRec})
        .then(result=>{
            this.loadingupdate=true;
            if(result==null){
            console.log('result::'+result);           
            this.dispatchEvent(new CustomEvent('closemodal'));          
            this.dispatchEvent(
                new ShowToastEvent({
                    //title: 'Success!!',
                    message: 'The record has been updated successfully',
                    variant: 'success',
                
                }),
            );           
            }
           else if(result!=null){
                console.log('error::'+result);
                this.dispatchEvent(new CustomEvent('closemodal'));
                this.dispatchEvent(
                    new ShowToastEvent({
                        //title: 'Error!!',
                        message: result,
                        variant: 'error',
                    }),
                );
            }
                return refreshApex(result);
          })

        .catch(error=>{
            });
    }

}