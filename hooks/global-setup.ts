import  {FullConfig} from '@playwright/test';

async function globalSetup(config: FullConfig) : Promise<void> {
    console.log('Setting up DEMOQA test ' );
}

export default globalSetup;
