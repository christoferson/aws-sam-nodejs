const axios = require('axios')
const url = 'http://checkip.amazonaws.com/';
let response;

// Get the DynamoDB table name from environment variables
const tableName = process.env.ECHO_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    try {
        const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'List abra kadabra',
                location: ret.data.trim(),
                dynamotable: tableName
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
