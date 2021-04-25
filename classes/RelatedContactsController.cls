public class RelatedContactsController {
    @AuraEnabled
    public static List<Contact> getRelatedContacts(String recordId){
        System.debug('Enter This=======>');
        Schema.SObjectType token = Id.valueOf(recordId).getSObjectType();
        Schema.DescribeSObjectResult dr = token.getDescribe();
        string objName = dr.getName();
        List<Contact> con_list = new List<Contact>();
        con_list = [SELECT id, Name, Email, Owner.Name
                    FROM Contact 
                    WHERE AccountId =:recordId];
        
        return con_list;
    }
    
    @AuraEnabled
    public static void updateRelatedContacts(List<Contact> contact_recs){
        system.debug('service_order_list::'+contact_recs);
        Database.SaveResult[] sr_list = database.update(contact_recs, false);
    }
}