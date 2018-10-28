const environments = {};

environments.staging = {
    "port": "3002",
    "envName": "staging",
    "httpsPort": "3003"
}

environments.production = {
    "port": "5002",
    "envName": "production",
    "httpsPort": "5003"
}

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : '';

export const envtoPass = typeof(environments[currentEnv]) !== 'undefined' ? environments[currentEnv] : environments.staging;



