
export default function SaveIcon(props: {
    onClick?: () => void;
}) {
    return (
        <button
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            onClick={props.onClick}
            title="Save changes"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2m-4-4V4a2 2 0 00-2-2H5a2 2 0 00-2 2v12m14-4h.01M9 12h.01M12 12h.01M15 12h.01" />
            </svg>
        </button>
    );
}