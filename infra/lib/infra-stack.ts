import { Stack, StackProps, RemovalPolicy, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class MosqueInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'MosquesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'Mosques',
    });

    const handler = new NodejsFunction(this, 'ApiLambda', {
      entry: path.resolve(__dirname, '../../backend/src/lambda.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 512,
      timeout: Duration.seconds(15),
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment: {
        DYNAMO_TABLE: table.tableName,
      },
    });

    table.grantReadData(handler);

    const api = new apigw.LambdaRestApi(this, 'MosqueApi', {
      handler: handler,
      proxy: true,
      deployOptions: {
        stageName: 'prod',
      },
    });

    new CfnOutput(this, 'ApiUrl', { value: api.url });
    new CfnOutput(this, 'TableName', { value: table.tableName });
  }
}

