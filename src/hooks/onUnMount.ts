import { useEffect } from "react"

export const onUnMount = (fn: () => void) => {
    if (!(fn instanceof Function)) {
        throw Error("fn is not function")
    }

    useEffect(() => {
        return () => {
            fn()
        }
    })
}