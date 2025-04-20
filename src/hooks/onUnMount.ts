import { useEffect } from "react"

export default function onUnMount(fn: () => void) {
    if (!(fn instanceof Function)) {
        throw Error("fn is not function")
    }

    useEffect(() => {
        return () => {
            fn()
        }
    })
}