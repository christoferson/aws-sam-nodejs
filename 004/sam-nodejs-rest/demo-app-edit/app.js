let response;

const tableName = process.env.ECHO_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.lambdaHandler = async (event, context) => {

    if (event.httpMethod !== 'POST') {
        throw new Error(`Edit only accepts POST method. Input: ${event.httpMethod}`);
    }

    const id = event.pathParameters.id;

    console.log(`Edit Item. ID=${id} Body=${event.body}`);

    let item = {};

    try {

        let params = {
            TableName : tableName,
            Key: { id: id },
          };
          const data = await docClient.get(params).promise();
          item = data.Item;
          
        console.log(`Edit Item. Data=${item}`);          

    } catch (err) {
        console.log(err);

        let errresponse = {
            'statusCode': 401,
            'body': JSON.stringify({
                message: `Edit - Error=${err}`
            })
        };        
        return errresponse;

    }
    
    if (item === undefined) {
        console.log(`Edit Item. Item ${id} not found.`);
        let errresponse = {
            'statusCode': 401,
            'body': JSON.stringify({
                message: `Edit - Unregistered Item. ID=${id}`
            })
        };        
        return errresponse;
    }
    
    try {

        const body = JSON.parse(event.body);
        let cversion = Number(body.Version);
        let nversion = cversion + 1;
        
        console.log(`Edit Item. ID=${id} Version=${body.Version}`);          
            
        let params = {
            TableName : tableName,
            Key: { id: id },
            UpdateExpression: "set #Level = :level, #Language = :language, #Version = :version",
            ConditionExpression: "attribute_exists(#Version) AND #Version = :current_version",
            ExpressionAttributeNames: {
                "#Level": "Level",
                "#Language": "Language",
                "#Version": "Version"
            },
            ExpressionAttributeValues: {
                ":level": body.Level,
                ":language": body.Language,
                ":version" : nversion,
                ":current_version": cversion,
            }
          };
        
        await docClient.update(params).promise();

    } catch (err) {
        console.log(err);

        let errresponse = {
            'statusCode': 401,
            'body': JSON.stringify({
                message: `Edit - Error=${err}`
            })
        };        
        return errresponse;
        
    }    
    
    response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `Edit - Item Modified. ID=${id}`,
            item: item
        })
    };
    

    return response;

    
};
