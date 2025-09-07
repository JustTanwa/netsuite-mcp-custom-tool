/**
 * ts_ns_search_tool.js
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
 
define(['N/task', 'N/runtime', 'N/file'], function(task, runtime, file) {

    return {
        ts_check_task_is_available: function (args) {
            return JSON.stringify(task)
        },
        ts_run_saved_search_task: function (args) {
            const searchId = args.searchId
            if (!searchId) return 'Search ID missing';
            const searchTaskObj = task.create({
                taskType: task.TaskType.SEARCH
            })
            searchTaskObj.savedSearchId = searchId;
            const destination = 'SuiteScripts/search_' + searchId + new Date().getTime() + '.csv';
            searchTaskObj.filePath = destination;
            const searchTaskId = searchTaskObj.submit()
            return JSON.stringify({
                ...task.checkStatus({ taskId: searchTaskId}),
                taskId: searchTaskId,
                filePath: destination
            })
        },
        ts_check_task_status: function (args) {
            if (!args.taskId) return 'Task ID misisng';
            return JSON.stringify(task.checkStatus({ taskId: args.taskId}))
        },
        ts_get_file_content: function (args) {
            if (!args.filePath ) return 'File Path missing';
            return file.load({id: args.filePath}).getContents()
        }
    }
}); 