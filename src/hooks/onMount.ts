import { useEffect } from "react"

export default function onMount(fn: () => void) {
    if (!(fn instanceof Function)) {
        throw Error("fn is not function")
    }

    useEffect(() => {
        fn()
    })
}