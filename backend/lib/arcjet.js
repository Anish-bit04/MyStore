import arcjet,{tokenBucket,shield,detectBot} from "@arcjet/node";

import "dotenv/config";

export const arcjetMiddleware = arcjet({
    key:process.env.ARCJET_KEY,
    characteristics:["ip.src"],
    rules:[
        shield({mode:"LIVE"}),
        detectBot({mode:"LIVE",
            // block all bots expect search engines
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        tokenBucket({mode:"LIVE",
            refillRate:10,
            interval:5,
            capacity:15
        })
        // almost 10 request in 4 sec.
    ]
})  
