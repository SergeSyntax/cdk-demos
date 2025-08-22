// import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface CommonProps {
  // Define construct properties here
}

export class Common extends Construct {

  constructor(scope: Construct, id: string, props: CommonProps = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, 'CommonQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
