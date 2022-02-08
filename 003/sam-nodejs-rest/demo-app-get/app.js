// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

const tableName = process.env.ECHO_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const mydateutils = require("/opt/nodejs/mydateutils");
const getAddressFromZipCode = require("/opt/nodejs/lib/getAddressFromZipCode");

exports.lambdaHandler = async (event, context) => {

    if (event.httpMethod !== 'GET') {
        throw new Error(`Get only accepts GET method. Input: ${event.httpMethod}`);
    }

    const id = event.pathParameters.id;

    let item = {};

    try {

        var params = {
            TableName : tableName,
            //Key: { id: id },
            Key: { Region: "US", CharacterName: id },
          };
          const data = await docClient.get(params).promise();
          item = data.Item;

    } catch (err) {
        console.log(err);
        return err;
    }


    let x = await getAddressFromZipCode("8u3453");
    let y = await mydateutils.currentDate();

    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Get abra kadabra',
                layerfunction: x,
                layerfunctiony: y,
                // location: ret.data.trim()
                item: item
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
