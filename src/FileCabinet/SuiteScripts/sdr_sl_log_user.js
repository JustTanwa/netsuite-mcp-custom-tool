/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([
   'N/record',
], function(record) {
    return {
        onRequest: function (context) {
           var request  = context.request;
           var expRepNo = request.parameters.tranId;
           var employeeId = -5;
           
           var employee = record.load({
              type : record.Type.EMPLOYEE,
              id   : employeeId
           });
           
           log.debug('User ' + employee.getValue('entityid') +
            ' opened expense report number ' + expRepNo);
        }
    };
});