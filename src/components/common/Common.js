import {notification} from 'antd';

export function notifySuccess() {
    notification['success']({
        message: '操作成功'
    });
}

export function notifyError(text) {
    notification['error']({
        message: text || '操作失败'
    });
}
