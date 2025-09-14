/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/log'], function(file, log) {
    
    /**
     * Get method to retrieve file content by internal ID
     * @param {Object} requestParams - Request parameters object
     * @param {string} requestParams.fileId - Internal ID of the file to retrieve
     * @returns {Object} Response object containing file details and content
     */
    function getFile(requestParams) {
        try {
            log.debug('getFile request', requestParams);
            
            if (!requestParams || !requestParams.fileId) {
                throw new Error('fileId parameter is required');
            }

            const fileObj = file.load({
                id: requestParams.fileId
            });

            return {
                success: true,
                file: {
                    id: fileObj.id,
                    name: fileObj.name,
                    description: fileObj.description,
                    path: fileObj.path,
                    size: fileObj.size,
                    url: fileObj.url,
                    contents: fileObj.getContents()
                }
            };
        } catch (error) {
            log.error('Error in getFile', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    return {
        get: getFile
    };
});