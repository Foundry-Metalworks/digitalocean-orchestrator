import {ParsedQs} from "qs";

export function config(params: ParsedQs = {}) {
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.DIGITALOCEAN_KEY}`
        },
        params
    }
}