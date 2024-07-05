interface Props {
    className?: string
}

export default function Loading({className}: Props) {
    return (
        <div className={`w-6 h-6 border-2 border-transparent border-t-white rounded-full spinner ${className} `} />
    )
}