import { Image } from "@chakra-ui/react"

export default function Logo(props) {
    const widths = {
        'sm': 150,
        'md': 300,
        'lg': 500
    }

    return (
        <Image src='/logo.png' alt='Redigo logo' width={widths[props.size||'md']}/>
    )
}