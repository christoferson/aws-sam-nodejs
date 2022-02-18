# aws-sam-nodejs
Aws Serverless Application Model - NodeJs

## 001 sam-nodejs-rest

Basic Single Lambda Example

## 002 sam-nodejs-rest

Rest Service Multi Lambda Example

## 003 sam-nodejs-rest

With Layer for Common Dependency


## Notes

### Prevent SAM from creating Stage StageName
Globals:
  Api:
    OpenApiVersion: 3.0.2

### Specify the StageName instead of the default Prod

Define the API
  Api:
    Type: AWS::Serverless::Api
    Properties:
      StageName: dev

Reference the API in the Function using RestApiId property   
  LambdaFunctionList:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Events:
        EchoFind:
          Type: Api
          Properties:
            ...
            RestApiId: !Ref Api

### Customize Lambda Log Retention Period

  LogGroupFunctionEdit:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub /aws/lambda/${LambdaFunctionEdit}
      RetentionInDays: 1


### Exporting Functions form Common Layer

Lambda will expose modules under /opt path
Source: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html

## Refernces

### SAM Policy Template List

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-template-list.html