let msgTypeMap = new Map();
msgTypeMap.set(1, '微信');
msgTypeMap.set(2, '钉钉群');
msgTypeMap.set(3, '短信');
msgTypeMap.set(4, '推送');
msgTypeMap.set(5, '邮件');
msgTypeMap.set(6, '机器人');

let msgTypeTextMap = new Map();
msgTypeTextMap.set('1-1', '微信/文本');
msgTypeTextMap.set('1-2', '微信/模板消息');
msgTypeTextMap.set('2-1', '钉钉/文本');
msgTypeTextMap.set('2-2', '钉钉/链接');
msgTypeTextMap.set('3-1', '短信/云片');
msgTypeTextMap.set('3-2', '短信/筑望');
msgTypeTextMap.set('3-3', '短信/联江');
msgTypeTextMap.set('3-9', '短信/智能短信');
msgTypeTextMap.set('4-1', '推送/文本');
msgTypeTextMap.set('5-1', '邮件/文本');
msgTypeTextMap.set('6-1', '机器人/文本');
msgTypeTextMap.set('6-2', '机器人/链接');

let childTypeTextMap = new Map();
childTypeTextMap.set('1-1', '文本');
childTypeTextMap.set('1-2', '模板消息');
childTypeTextMap.set('2-1', '文本');
childTypeTextMap.set('2-2', '链接');
childTypeTextMap.set('3-1', '云片');
childTypeTextMap.set('3-2', '筑望');
childTypeTextMap.set('3-3', '联江');
childTypeTextMap.set('3-9', '智能短信');
childTypeTextMap.set('4-1', '文本');
childTypeTextMap.set('5-1', '文本');
childTypeTextMap.set('6-1', '文本');
childTypeTextMap.set('6-2', '链接');

export function msgType(key) {
    return msgTypeMap.get(key);
}

export function msgTypeText(key) {
    return msgTypeTextMap.get(key);
}

export function childTypeText(key) {
    return childTypeTextMap.get(key);
}

