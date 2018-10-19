const env = process.env.NODE_ENV;

const MESSAGE_URL = {
    'development': 'http://api.msg.72solo.com',
    'test': 'http://api.msg.36solo.com',
    'stage': 'http://api.msg.32solo.com',
    'production': 'http://api.msg.inno72.com'
};

const ALARM_URL = {
    'development': 'http://127.0.0.1:8085',
    'test': 'http://api.alarm-service.36solo.com',
    'stage': 'http://api.alarm-service.32solo.com',
    'production': 'http://api.alarm-service.inno72.com'
};

const ACTIVE_URL = {
    'development': 'http://127.0.0.1:8089',
    'test': "http://api.bi.36solo.com",
    'stage': "http://api.bi.32solo.com",
    'production': "http://api.bi.inno72.com",
};

const CRONTAB_URL = {
    'development': 'http://172.16.26.180:8892',
    'test': "http://admin.schedule.36solo.com",
    'stage': "http://admin.schedule.32solo.com",
    'production': "http://admin.schedule.72solo.com",
};

const URLS = {
    'MESSAGE_URL': MESSAGE_URL,
    'ALARM_URL' : ALARM_URL,
    ACTIVE_URL,
    CRONTAB_URL,
};

export function urls(key) {
    console.log('env is ' + env + ' key is ' + key);
    return URLS[key][env];
}

