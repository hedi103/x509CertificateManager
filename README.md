# x509 Certificate Manager

It's a Node.js script that encrypts a x509 Certificate and save the encrypted content in a non relational database.

The script is runnable on an AWS stack: Lambda function, S3 bucket and DynamoDB.

## Basic requirements
Node.js

## Usage: Full could
In order to deploy this infrastructure, the script was coupled with the all-in-one framework Serverless.

1- Install the Serverless framework:
```bash
npm install -g serverless
```
2- Configure your AWS credentials following this [instructions](https://www.serverless.com/framework/docs/providers/aws/guide/credentials). 

3- Clone the Github repo. Use the main branch.

4- Run the Serverless deployement command which will create the AWS stack descried in serverless.yml on your AWS console:
```bash
sls deploy
```
5- Check that the resources were created successfully in your AWS console.

6- Use the same deployement command to update your stack whenever you make adjustements.

7- You can, also, use this command to run the Js script from your IDE terminal once the stack is deployed:
```bash
npm run locally
```
but you must install all the required js libraries locally using:
```bash
npm install
```

## Usage: Full local
In order to run the script locally, we can use [Localstack](https://github.com/localstack/localstack) : a Docker container that mimic AWS functionality in our local development environment. Please follow the Localstack guide in order to run the stack locally.