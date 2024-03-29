# aws-sam-nodejs
Aws Serverless Application Model - NodeJs

## 001 sam-nodejs-rest

Basic Single Lambda Example

## 002 sam-nodejs-rest

Rest Service Multi Lambda Example

## 003 sam-nodejs-rest + common layer

With Layer for Common Dependency

## 004 sam-nodejs-rest + lambda authorizer

With Lambda Authorizer (Token Based)

Curl Commands (List method does not require Authorization)

curl https://xxx.execute-api.eu-west-1.amazonaws.com/dev/echo/
curl https://xxx.execute-api.eu-west-1.amazonaws.com/dev/echo/35 --header "Authorization: allow"
curl https://xxx.execute-api.eu-west-1.amazonaws.com/dev/echo/35 --header "Authorization: deny"
curl https://xxx.execute-api.eu-west-1.amazonaws.com/dev/echo/35 --header "Authorization: unauthorized"

Edit - No Locking
curl -X POST -H "Content-Type: application/json" ^
-d "{\"Name\": \"Adria\", \"Level\": \"42\"}" ^
https://xxx.execute-api.eu-west-1.amazonaws.com/dev/echo/35 --header "Authorization: allow"

Edit - Add Optimistic Locking
curl -X POST -H "Content-Type: application/json" ^
-d "{\"Name\": \"Adria\", \"Level\": \"45\", \"Language\": \"EN\", \"Version\": \"1\"}" ^
https://xxx.execute-api.eu-west-1.amazonaws.com/dev/echo/001 --header "Authorization: allow"

Api Gateway Authorizer Types:
1. token-based Lambda authorizer function
2. request-based Lambda authorizer function

## Notes

### Prevent SAM from creating Stage StageName

```yaml
Globals:
  Api:
    OpenApiVersion: 3.0.2
```

### Specify the StageName instead of the default Prod

Define the API

```yaml
  Api:
    Type: AWS::Serverless::Api
    Properties:
      StageName: dev
```

Reference the API in the Function using RestApiId property   

```yaml
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
```

### Customize Lambda Log Retention Period

```yaml
  LogGroupFunctionEdit:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub /aws/lambda/${LambdaFunctionEdit}
      RetentionInDays: 1
```

### Exporting Functions form Common Layer

Lambda will expose modules under /opt path
Source: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html

### Code Deploy Integration using Lambda Alias and Version

Setup CodeDeploy that will initiate LinearDeployment 10 percent every 2 minutes

```yaml
      AutoPublishAlias: live
      DeploymentPreference:
       Type: Linear10PercentEvery2Minutes 
```

### Lambda Autorizer - Define Authorizer (MyLambdaAuthorizer) in Api Gateway

```yaml
  Api:
    Type: AWS::Serverless::Api
    Properties:
      ...
      Auth:
        DefaultAuthorizer: MyLambdaAuthorizer
        Authorizers:
          MyLambdaAuthorizer:
            FunctionArn: !GetAtt LambdaAuthorizerFunction.Arn
            Identity:
              ReauthorizeEvery: 0
```

### Lambda Authorizer - Disable Authorizer for specific method

```yaml
  LambdaFunctionList:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Events:
        EchoFind:
          Type: Api
          Properties:
            ...
            Auth:
              Authorizer: NONE # Disable Authorizers
```

### Edit Optimistic Locking

Current version is cversion, New version is nversion

```js
  let params = {
      TableName : tableName,
      Key: { id: id },
      UpdateExpression: "set #Version = :version",
      ConditionExpression: "attribute_exists(#Version) AND #Version = :current_version",
      ExpressionAttributeNames: { "#Version": "Version" },
      ExpressionAttributeValues: { ":current_version": cversion, ":version" : nversion},
      ReturnValues: "ALL_NEW",
  };

  const result = await docClient.update(params).promise();
```

### Return Values after updating Dynamo Item

Set the ReturnValues parameter to select the type of value to return.

```js
params {
   ...
   ReturnValues: "ALL_NEW"
}
const result = await docClient.update(params).promise();
// Access ReturnValues from result.Attributes
item = {
    "id" : id,
    "Language": result.Attributes.Language,
    "Level": result.Attributes.Level,
    "Version": result.Attributes.Version,
    "Name": result.Attributes.Name            
};
```

## References

### SAM Policy Template List

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-template-list.html

## Todo

- [ ]  Gateway Responses

- [ ] CORS Configurtion

- [ ] Cognito Authorizer

- [ ] Usage Plans

- [ ] API Keys

- [ ] CloudWatch log role ARN

- [ ] Authorizer Role

- [ ] Add StageName as Parameter
