/**
 * exampletools.js
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
 
define(['N/sftp', 'N/file'], function(sftp, file) {
    return {
        add: function (args) {
            let a = args["a"];
            let b = args["b"];
            return a+b;
        },
        ts_get_file_from_ec2: function (args) {
            const directory = args["directory"] || '/out';
            try {
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
                    let fileObj = sftpConnection.download({
                        directory: './',
                        filename: file.name
                    })
                    file.content = fileObj.getContents();
                }
                return files
            } catch (error) {
                log.error("Error connecting to EC2", error);
                return JSON.stringify(error);
            }
            
        }
    }
}); 