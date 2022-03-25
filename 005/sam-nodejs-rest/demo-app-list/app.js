const axios = require('axios')
const url = 'http://checkip.amazonaws.com/';
let response;

// Get the DynamoDB table name from environment variables
const tableName = process.env.ECHO_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.lambdaHandler = async (event, context) => {

    if (event.httpMethod !== 'GET') {
        throw new Error(`List only accepts GET method. Input: ${event.httpMethod}`);
    }

    let items = {};

    try {
        var params = {
            TableName : tableName
        };
        const data = await docClient.scan(params).promise();
        items = data.Items;
    } catch (err) {
        console.log(err);
        return err;
    }


    try {
        const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'List abra kadabra V2',
                location: ret.data.trim(),
                dynamotable: tableName,
                //items: JSON.stringify(items)
                items: items
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
