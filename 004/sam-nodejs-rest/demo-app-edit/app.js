let response;

const tableName = process.env.ECHO_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.lambdaHandler = async (event, context) => {

    if (event.httpMethod !== 'POST') {
        throw new Error(`Edit only accepts POST method. Input: ${event.httpMethod}`);
    }

    const id = event.pathParameters.id;
    
    console.log(`Edit Item. ID=${id}`);

    let item = {};

    try {

        var params = {
            TableName : tableName,
            Key: { id: id },
          };
          const data = await docClient.get(params).promise();
          item = data.Item;
          
        console.log(`Edit Item. Data=${item}`);          

    } catch (err) {
        console.log(err);
        return err;
    }
    
    if (item === undefined) {
        console.log(`Edit Item. Item ${id} not found.`);
        response = {
            'statusCode': 401,
            'body': JSON.stringify({
                message: `Edit - Unregistered Item. ID=${id}`
            })
        };        
    } else {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `Edit - Item Modified. ID=${id}`,
                item: item
            })
        };
    }

    return response;

    
};
