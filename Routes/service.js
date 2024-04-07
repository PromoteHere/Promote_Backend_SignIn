let NoOfAPIHits = 0; //NoOfAPIHitsToTheServer
let NoOfAPIHitOnSpecificEndpoint = []//NoOfAPIHits To The Specific end point
let logs=[] //overall logs
function APILogs(request, response) { //function to collect the logs
    if (logs?.length > 50) { //storing last 50 API details logs - to avoid performance issues
        logs.shift();
    }
    let ip = request?.headers['x-forwarded-for'] || request?.socket?.remoteAddress || null; // contains IP details
    let device = request?.headers['user-agent']; //contains browser and other details
    NoOfAPIHits++;
    NoOfAPIHitOnSpecificEndpoint[request?.originalUrl] = NoOfAPIHitOnSpecificEndpoint[request?.originalUrl] ? NoOfAPIHitOnSpecificEndpoint[request?.originalUrl]+1 :1
    let Post_details_DB = {
        IP: ip,
        timeStamp: Date(),
        Device_details: device,
        query: JSON.stringify(request?.query),
        body: request?.body,
        path: request?.originalUrl,
        NoOfAPIHitsToTheServer: NoOfAPIHits,
        NoOfAPIHitOnSpecificEndpoint: { ...NoOfAPIHitOnSpecificEndpoint }
    };
    logs = [...logs, Post_details_DB]
    return logs;
}
module.exports = APILogs;