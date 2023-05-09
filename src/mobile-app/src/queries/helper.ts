import Constants from "expo-constants";

const apiKey = Constants.expoConfig?.extra?.apiKey || "";
const baseUrl = Constants.expoConfig?.extra?.baseUrl || "";

export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export const getDefaultHeader = (): Headers => {
    const headers: Headers = new Headers();
    headers.append("api-key", apiKey);
    return headers;
};

export const buildRequest = (
    path: string,
    method: Method = Method.GET,
    headers: Headers = getDefaultHeader(),
    body?: any
) => {
    const url = baseUrl + path;
    const payload: any = {
        method: method,
        headers: headers
    };
    if (body) {
        payload["body"] = JSON.stringify(body);
    }
    return new Request(url, payload);
};

export const actionQuery = (actionName: string, body: any) => {
    const path = "/converter/" + actionName;
    const headers: Headers = getDefaultHeader();
    headers.append("Content-Type", "application/json");
    return buildRequest(path, Method.POST, headers, body);
};
