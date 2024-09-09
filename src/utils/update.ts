import { ossUrl } from '@/api/pms/goods';

function sendRequest(): string | null {
    let xmlhttp: XMLHttpRequest | null = null;

    // 判断浏览器支持的 XMLHttpRequest 类型
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window && (window as any).ActiveXObject) {
        xmlhttp = new (window as any).ActiveXObject("Microsoft.XMLHTTP") as any; // 类型断言
    }

    if (xmlhttp) {
        const tokenUrl = ossUrl; // URL 从外部导入
        const serverUrl = `${tokenUrl}/oss/v1/oss/token`; // 构建完整的请求 URL

        xmlhttp.open("GET", serverUrl, false);

        try {
            xmlhttp.send(null);
            return xmlhttp.responseText;
        } catch (error) {
            console.error("请求失败:", error);
            return null;
        }
    } else {
        alert("Your browser does not support XMLHTTP.");
        return null;
    }
}

export default sendRequest;
