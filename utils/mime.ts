import {getExtension} from "mime"

export const toExtension = (mime: string): string => {
    const ext = getExtension(mime)
    if (ext) {
        return ext
    } else {
        return "jpg"
    }
}
