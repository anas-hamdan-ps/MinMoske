#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MosqueInfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new MosqueInfraStack(app, 'MosqueInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-north-1',
  },
});

