"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MosqueInfraStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const apigw = __importStar(require("aws-cdk-lib/aws-apigateway"));
const path = __importStar(require("path"));
class MosqueInfraStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const table = new dynamodb.Table(this, 'MosquesTable', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            tableName: 'Mosques',
        });
        const handler = new lambda.Function(this, 'ApiLambda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromAsset(path.resolve(__dirname, '../../../backend/dist')),
            memorySize: 512,
            timeout: aws_cdk_lib_1.Duration.seconds(15),
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
        new aws_cdk_lib_1.CfnOutput(this, 'ApiUrl', { value: api.url });
        new aws_cdk_lib_1.CfnOutput(this, 'TableName', { value: table.tableName });
    }
}
exports.MosqueInfraStack = MosqueInfraStack;
