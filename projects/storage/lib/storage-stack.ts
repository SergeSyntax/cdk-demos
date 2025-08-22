import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, 'L3Bucket', {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(expiration)
        }
      ]
    });
  }
}

export class StorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const duration = new cdk.CfnParameter(this, 'duration', {
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: 'Number'
    });

    // The code that defines your stack goes here
    new CfnBucket(this, 'L1Bucket', {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 1,
            status: 'Enabled'
          }
        ]
      }
    });

    const l2Bucket = new Bucket(this, 'L2Bucket', {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(duration.valueAsNumber)
        }
      ]
    });

    new cdk.CfnOutput(this, 'L2BucketName', {
      value: l2Bucket.bucketName
    });

    const lastSnippetOfCfId =(stackId: string) => {
      const shortStackID = cdk.Fn.select(2, cdk.Fn.split('/', stackId))
    }

    const stackId =
    // example resource
    // const queue = new sqs.Queue(this, 'StorageQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
