import { useEffect } from "react"

export const onMount = (fn: () => void) => {
    if (!(fn instanceof Function)) {
        throw Error("fn is not function")
    }

    useEffect(() => {
        fn()
    })
}