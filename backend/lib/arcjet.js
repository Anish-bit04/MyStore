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
            refillRate:5,
            interval:10,
            capacity:10
        })
        // almost 10 request in 4 sec.
    ]
})  
