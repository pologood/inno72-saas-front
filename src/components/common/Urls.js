const env = process.env.NODE_ENV;

const MESSAGE_URL = {
    'development': 'http://api.msg.inner.72solo.com',
    'test': 'http://api.msg.inner.36solo.com',
    'production': 'http://api.msg.inner72.com'
};

const ALARM_URL = {
    'development': 'http://127.0.0.1:8082',
    'test': 'http://pre_test.72solo.com:30516',
    'production': 'http://pre_test.72solo.com:30516'
};

const URLS = {
    'MESSAGE_URL': MESSAGE_URL,
    'ALARM_URL' : ALARM_URL
};

export function urls(key) {
    console.log('env is ' + env + ' key is ' + key);
    return URLS[key][env];
}

