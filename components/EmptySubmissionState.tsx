interface EmptySubmissionStateProps {
  submissionLink: string
}

const EmptySubmissionState: React.FC<EmptySubmissionStateProps> = ({ submissionLink }) => {
  return (
    <a
      type="button"
      target="_blank"
      href={submissionLink}
      className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 512 512">
        <circle cx={256} cy={256} r={256} fill="#ffd93b" />
        <path
          d="M512 256c0 141.44-114.64 256-256 256-80.48 0-152.32-37.12-199.28-95.28 43.92 35.52 99.84 56.72 160.72 56.72 141.36 0 256-114.56 256-256 0-60.88-21.2-116.8-56.72-160.72C474.8 103.68 512 175.52 512 256z"
          fill="#f4c534"
        />
        <g fill="#3e4347">
          <path d="M332.432 384.8c0 7.472-5.968 13.328-13.328 13.328H192.912c-7.36 0-13.328-5.872-13.328-13.328 0-7.36 5.968-13.328 13.328-13.328h126.192c7.344 0 13.328 5.968 13.328 13.328zM111.808 261.68c6.256-3.68 24.768 16.16 53.84 17.248 30.096 1.12 47.584-20.928 53.84-17.248 7.792 2.672-2.832 53.552-53.84 53.744-50.992-.192-61.632-51.072-53.84-53.744z" />
        </g>
        <path
          d="M99.808 239.312c-5.808-.928-9.776-6.4-8.832-12.224.944-5.808 6.32-9.792 12.224-8.832 59.968 9.632 78.192-33.2 78.368-33.632 2.208-5.456 8.416-8.08 13.904-5.856 5.456 2.224 8.08 8.448 5.856 13.904-12.032 29.472-49.824 54.944-101.52 46.64z"
          fill="#e9b02c"
        />
        <path
          d="M400.192 261.68c-6.256-3.68-24.768 16.16-53.84 17.248-30.096 1.12-47.584-20.928-53.84-17.248-7.792 2.672 2.832 53.552 53.84 53.744 50.992-.192 61.632-51.072 53.84-53.744z"
          fill="#3e4347"
        />
        <path
          d="M310.672 192.656c-2.224-5.456.4-11.68 5.856-13.904 5.44-2.224 11.648.384 13.888 5.808.8 1.92 19.12 43.216 78.384 33.696 5.872-.96 11.296 3.024 12.224 8.832.928 5.824-3.024 11.296-8.832 12.224-51.328 8.256-89.392-16.912-101.52-46.656z"
          fill="#e9b02c"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">We were not able to load any submissions for this contest</h3>
      <span className="mt-1 text-sm text-gray-500">Click here to submit an entry!</span>
    </a>
  )
}

export default EmptySubmissionState