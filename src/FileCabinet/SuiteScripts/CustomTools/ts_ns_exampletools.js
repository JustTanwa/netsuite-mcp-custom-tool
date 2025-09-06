/**
 * exampletools.js
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
 
define(['N/sftp', 'N/runtime'], function(sftp, runtime) {

    function validateAndSanitizePath(path) {
        // Remove any ../ attempts
        const sanitized = path.replace(/\.\./g, '');
        const allowedBases = ['/out', '/data', '/temp'];
        if (!allowedBases.some(base => sanitized.startsWith(base))) {
            throw new Error('Invalid directory path');
        }
        return sanitized;
    }

    return {
        add: function (args) {
            let a = args["a"];
            let b = args["b"];
            return a+b;
        },
        ts_get_file_from_ec2: function (args) {
            const directory = validateAndSanitizePath(args["directory"] || '/out');
            try {
                // Can abstract into a custom record or something (I assume there will be script parameter in future)
                const sftpConnection = sftp.createConnection({
                    url: 'url',
                    hostKey: 'hostKey',
                    username: 'username',
                    secret: 'custsecret_your_password',
                    port: 22,
                    directory: directory
                });
                const filesList = sftpConnection.list();
                let files = filesList.filter(file => !file.directory);
                for (let file of files) {
                    if (runtime.getCurrentScript().getRemainingUsage() < 100) break; // quite expensive to download
                    let fileObj = sftpConnection.download({
                        directory: './',
                        filename: file.name
                    })
                    file.content = fileObj.getContents();
                }
                return files
            } catch (error) {
                log.error("Error connecting to EC2", error);
                return JSON.stringify({error: "File fetching failed"});
            }
        },
        getRemainingUsage: function (args) {
            return JSON.stringify({
                script: runtime.getCurrentScript(),
                usageRemaining: runtime.getCurrentScript().getRemainingUsage()
            })
        },
        reverseString: function(args) {
            var input = args["input"] || "";
            return {
                reversed: input.split("").reverse().join("")
            };
        }
    }
}); 