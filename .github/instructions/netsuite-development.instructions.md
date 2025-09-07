---
applyTo: '**'
---
# SuiteCloud AI Development Instructions

## Core Capabilities

### File System Access
- **Full workspace editing**: You can create, read, and modify any files in the project workspace
- **Directory management**: Create and organize directory structures as needed
- **File type handling**: Work with JavaScript (.js), JSON, XML, and other project files

### SuiteScript 2.1 Development Standards

#### Code Formatting
- **Indentation**: Use exactly 4 spaces for indentation (no tabs)
- **Line endings**: Use consistent line endings appropriate for the development environment
- **Code structure**: Follow NetSuite SuiteScript 2.1 best practices

#### SuiteScript 2.1 Specifications
- Write all JavaScript code using SuiteScript 2.1 API
- Use proper module imports/exports with `define()` function
- Implement appropriate entry points (e.g., beforeLoad, beforeSubmit, afterSubmit)
- Follow NetSuite naming conventions and coding standards
- Include proper error handling and logging using `log` module

#### Example SuiteScript Structure
```javascript
/**
 * @NApiVersion 2.1
 * @NScriptType [ScriptType]
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record'], function(log, record) {
    
    function beforeLoad(scriptContext) {
        // Implementation with 4-space indentation
        try {
            log.debug('Function Entry', 'beforeLoad executed');
            // Your code here
        } catch (error) {
            log.error('Error in beforeLoad', error.toString());
        }
    }
    
    return {
        beforeLoad: beforeLoad
    };
});
```

### Deployment Management

#### SuiteCloud CLI Commands
- **Full deployment**: Use `suitecloud project:deploy` to deploy entire project
- **Selective deployment**: Modify `deploy.xml` for targeted file deployment
- **Object creation**: Ensure all necessary object XML files are created in the Objects directory
- **Validation**: Use `suitecloud project:validate` before deployment when appropriate

#### Deploy.xml Configuration
For selective file deployment, modify the `deploy.xml` file with this structure:

```xml
<deploy>
    <files>
        <path>~/FileCabinet/[file_path]</path>
        <!-- Add additional file paths as needed -->
    </files>
    <objects>
        <path>~/Objects/*</path>
    </objects>
</deploy>
```

### Example Object XML File for SuiteScript
```xml
<suitelet scriptid="customscript_sdr_sl_log_user">
  <description>Log user information when an expense report is edited. This will be called from a client script.</description>
  <isinactive>F</isinactive>
  <name>SuiteDreams SL Log User</name>
  <notifyadmins>F</notifyadmins>
  <notifyemails></notifyemails>
  <notifyowner>T</notifyowner>
  <notifyuser>F</notifyuser>
  <scriptfile>[/SuiteScripts/sdr_sl_log_user.js]</scriptfile>
  <scriptdeployments>
    <scriptdeployment scriptid="customdeploy_sdr_sl_log_user">
      <allemployees>F</allemployees>
      <allpartners>F</allpartners>
      <allroles>F</allroles>
      <audslctrole></audslctrole>
      <eventtype></eventtype>
      <isdeployed>T</isdeployed>
      <isonline>F</isonline>
      <loglevel>DEBUG</loglevel>
      <runasrole></runasrole>
      <status>TESTING</status>
      <title>SuiteDreams SL Log User</title>
    </scriptdeployment>
  </scriptdeployments>
</suitelet>
```

#### Deployment Workflow
1. **Pre-deployment**: Validate code syntax and SuiteScript compliance
2. **Configure deployment**: Update `deploy.xml` if selective deployment is needed
3. **Object creation**: Ensure all necessary object XML files are created in the Objects directory
4. **Execute deployment**: Run `suitecloud project:deploy` command
5. **Post-deployment**: Verify deployment success and log results

## Operational Guidelines

### File Management
- Always maintain proper file organization within the NetSuite project structure
- Preserve existing file permissions and metadata
- Create backup copies of critical files before major modifications
- Use descriptive file names following NetSuite conventions

### Code Quality Assurance
- Validate SuiteScript 2.1 syntax before deployment
- Include comprehensive error handling
- Add appropriate logging for debugging and monitoring
- Follow NetSuite governance and security best practices

### Deployment Best Practices
- **Incremental deployments**: When possible, deploy only changed files
- **Environment awareness**: Understand target NetSuite environment requirements
- **Rollback preparation**: Be prepared to revert changes if deployment fails
- **Documentation**: Maintain deployment logs and change documentation

### Error Handling and Recovery
- Monitor deployment output for errors or warnings
- Implement retry logic for transient deployment failures
- Provide clear error messages and suggested resolutions
- Maintain deployment history for troubleshooting

## Command Reference

### Essential SuiteCloud CLI Commands
```bash
# Deploy entire project
suitecloud project:deploy

# Validate project before deployment
suitecloud project:validate
```

### File Path Examples for deploy.xml
```xml
<!-- Single script file -->
<path>~/FileCabinet/SuiteScripts/MyScript.js</path>

<!-- Multiple files -->
<path>~/FileCabinet/SuiteScripts/ClientScript.js</path>
<path>~/FileCabinet/SuiteScripts/UserEventScript.js</path>

<!-- Entire directory -->
<path>~/FileCabinet/SuiteScripts/*</path>
```

## Response Format

When working on tasks:
1. **Acknowledge the request** with understanding of scope
2. **Plan the approach** including file modifications and deployment strategy
3. **Execute changes** with proper code formatting (4 spaces)
4. **Prepare deployment** by configuring deploy.xml if needed
5. **Deploy and verify** using appropriate SuiteCloud commands
6. **Report results** with summary of changes and deployment status

## Security and Compliance
- Follow NetSuite security best practices
- Respect data privacy and access controls
- Validate all user inputs in SuiteScript code
- Implement appropriate role-based permissions
- Maintain audit trails for all deployments

Remember: You have full autonomy to edit any files in the workspace and deploy to NetSuite. Always prioritize code quality, proper formatting with 4-space indentation, and successful deployment outcomes.