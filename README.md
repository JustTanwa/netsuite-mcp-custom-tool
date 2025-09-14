# Netsuite AI Connector and MCP Custom Tool

This repository contains the necessary information for anyone looking to connect to NetSuite Connector AI without going through Claude and uses instead a combination of Postman and VS Code and its available tools.

I chose VS Code because it has built-in MCP Server and Copilot and it is **free!**

## Prerequisites

You will need to install some softwares to be able to follow along with this repository, but in theory you can adapt it to whatever tools you are comfortable with.

- VS Code (version 1.102+, for MCP Server)
- Access to Copliot (should be free with Github account)
- Node.js (version 22.x.x , for the [SuiteCloud CLI](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1558708810.html))
- Postman
- NetSuite Account Set up (you will need to set up NetSuite Role, and install a SuiteApp as per [documentation](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_0714080625.html), I recommend customizing standard CFO role and adding the need permissions)

## Preface

My motivation for all this is that I wanted to experiment with the new tools that NetSuite has released but I did not have a Claude Pro account to set up a custom MCP server connector and test the functionalities. I also wanted to try creating the new custom tool SuitScript type, and just in general learning and keeping up with the latest technologies. So I did a lot of reading and research, and resulting into what you will find in this repository. This repository is a result of my experimentation so if you are someone who likes to tinker you can take this as a starting point to play with.

## Getting Started

### Postman, the why?

Postman is a common API testing tool, it allows you to create and test API quickly. Postman will be the MCP client (NetSuite will be the MCP server) and is used to authenticate with NetSuite to get the Access Token so that it can later be used in VS Code to make the MCP server to client connection.

Using Postman, OAuth 2.0 is super easy, the user will need to login to NetSuite and authorize Postman so that it can use the code to get the access token. If you need more information, I suggest you read up on [OAuth 2.0 Authorization Code Grant](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type) (or ask AI to summary and explain it to you). It is not possible to create an Integration record yourself for each application, so you need to piggy-back off the Claude AI integration which is why you will see the hardcoded Client ID in the examples.

I have include a collection `netsuite_ai_connector_mcp_test.postman_collection` which you can import into Postman, it should have the things you need to authenticate to NetSuite MCP server and get the Access Token. You will have to do a few clicks:

1. Import Collection to Postman
2. Click on Collection Name
3. Click "variables" sub tab, and add your NetSuite Account ID to the `ACCOUNT_ID` variable
4. Click on "Auth" sub tab, scroll down and press "Get New Access Token"
5. Login to NetSuite (hopefully you have prepared a non-admin role already), read the Risk and Security message stuff, and click "Allow" (can be "Continue" as well)

After this, you will have Access Token which you can use to send message for list of tools and test the sample tools available. (No AI, just read the documentation and send JSON-RPC 2.0 messages).

### VS Code, the why?

VS Code is a populate tool for code editing, this summer Microsoft announced free Copilot (with limitation) for everyone so you will need to connect VS Code to Github so that your usage can be tracked. It also comes with MCP server so you can use Agent Mode on Copilot with the listed MCP servers you have set up. 

In the folder, you will find the `.vscode/mcp.json` file which set up how the MCP server can be configured to connect to a remote MCP server like NetSuite. You will need to copy the access token you received from Postman to the `ACCESS_TOKEN` proper of the `env` section (you can't miss it, the file is small). You will also need to input your NetSuite `ACCOUNT_ID` just as you have in Postman. Once you set this up, you can press `Start` to connect to the Netsuite MCP server, from there you can already start using the Copilot in Agent mode to interact with the MCP server.

You'll also be using VS Code to write the Custom Tool SuiteScript files and other project files.

### Node.js, the why?

Node.js is popular JavaScript runtime and it comes with a populate package manager called `npm`. Since VS Code native MCP server can only connect to a remote MCP server where you can set up the redirect URI, it is not possible to use it in this case due to the fact that it is currently not possible to create an integration record in Netsuite and one must piggy-back of the Claude AI's one. So, comes to rescue a Node package called `mcp-remote@latest` used to call the MCP server remotely rather than locally. 

Only configuration to the `.vscode/mcp.json` is needed, this is so that vscode can run the Node Pack Executor (npx) command to run that package mentioned above.

One package you need to install is the SuiteCloud Development Framework CLI, this achieved through `npm install -g @oracle/suitecloud-cli`, this is done so that the command `suitecloud` would be available for you to set up NetSuite project, link the NetSuite account and deploy the Custom Tool.

## List of Predefined MCP Tools

Although you can list the available tools by sending a JSON-RPC 2.0 to the MCP with the method = `tools/list`, NetSuite does not return which fields are required. So I have included the link to official docs here, [List of tools](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/T_section_8204806632_1.html#T_subsect_8204806633_1) and additionally you can see the sample tools implementation on their github repository [MCP Sample Tools](https://github.com/oracle-samples/netsuite-suitecloud-samples/tree/main/MCP-Sample-Tools).

## Custom Tool SuiteScript

This script is new, it allows you to use most of standard NetSuite N modules (with exception to http, https and search) to implement some custom logic that you would like the AI client to be able to do on the user's behalf. For this example, I took the sample code from official [NetSuite Custom Tool](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/T_section_0724071739_1.html#T_subsect_13192014863_1) to make sure that I can get it working before playing around with creating my own functions. I wanted to test if the `N/sftp` would work so I decided that would be part of the use case I will explore, the idea was if NetSuite was connected to some SFTP (or multiple), a user could prompt AI to fetch files for them and do certain things with said files. It was quite intuitive to write those Custom Tool scripts, with the addition of having to create a schema for the functions.

## Challenges

1. I initially wanted to connect VS Code with NetSuite AI Connector (MCP Server) just using the built-in configuration of VS Code with `MCP: Add Server` but it wasn't possible to change the redirect URI of the authorization with VS Code like you can with Postman so I decided to use Postman for the Access Token fetching step then copying over to VS Code after.

2. Environtment variables on the `mcp.json` file was something that I wanted to store outside of the file as a `.env` file but this file was not accessible in the `mcp.json` during launch. I tried to use property `envFile` but this was apprently only used after the MCP server has started so that you can load the content of `.env` into the MCP server environment. This means that you have to paste the access token in the `mcp.json` file, so I removed it when I pushed to github.

3. Custom Tool not found was an issue that I ran into when deploying the example tools, it looks a couple hours trying to figure out why the tool wasn't visible in `tools/list` message to the MCP server even though the SDF said it was successfully deployed. Turns out the issue was a typo, I only found this by comparing MCP Sample Tools' files so glad that NetSuite shared the source files for that SuiteApp. To deploy tools, you need to set XML property `exposeto3rdpartyagents` to `T`, since the typo was "exposeto3rdpartyagent", the custom tool I created was never deployed.

4. Update: I wanted to try to make those "vibe coded" application for Netsuite using AI agent and environmental set up. So first challenge was to make sure that AI could call command line tool such as "suitecloud-cli" and I ran into an issue that because I was using git-bash the PATH variable was not resolved properly for my "suitecloud-cli" and I could not get the Copilot to call python script either. So I had to switched to using PowerShell instead. With the combination of Copilot instruction file and pre-arranged scripts, I was about to test prompting creation of script using Copilot, with auto deployment and testing via RESTlet.

## Credits

[awesome-netsuite-ai](https://github.com/michoelchaikin/awesome-netsuite-ai) - This is a really helpful repository containing collection of NetSuite community guides and insights with NetSuite Connect AI and Custom Tool.

