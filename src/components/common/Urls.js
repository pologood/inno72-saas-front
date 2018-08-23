const MSGTEMPLATE_URL = {
    'development': 'http://api.msg.inner.72solo.com/msgTemplate',
    'test': 'http://api.msg.inner.36solo.com/msgTemplate',
    'production': 'http://api.msg.inner72.com/msgTemplate'
};

const MESSAGEHISTORY_URL = {
    'development': 'http://api.msg.inner.72solo.com/msg',
    'test': 'http://api.msg.inner.36solo.com/msg',
    'production': 'http://api.msg.inner72.com/msg'
};

const URLS = {
    'MSGTEMPLATE_URL': MSGTEMPLATE_URL,
    'MESSAGEHISTORY_URL' : MESSAGEHISTORY_URL
};

const env = process.env.NODE_ENV;

export function urls(key) {
    console.log('env is ' + env + ' key is ' + key);
    return URLS[key][env];
}

