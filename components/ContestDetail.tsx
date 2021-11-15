import { REDDIT_URL } from "libs/constants"
import { Contest } from "libs/contracts"

interface ContestDetailProps {
  contest: Contest
  onContestImageClick: () => void
}

const ContestDetail: React.FC<ContestDetailProps> = ({ contest, onContestImageClick }) => (
  <div>
    <div className="flex">
      <div className="w-6/12" onClick={onContestImageClick}>
        <img src={contest.imageUrl} className="shadow-lg rounded max-w-full h-auto align-middle border-none"/>
      </div>
      <div className="px-2 flex flex-col justify-center items-center">
        <div className="w-full">
          <a href={REDDIT_URL + contest.permalink} target="_blank">
            <h3 className="text-2xl font-bold leading-7 text-gray-500 sm:text-3xl">{contest.title}</h3>
          </a>
          <h4 className="text-base font-semibold leading-7 text-gray-700 sm:truncate">by {contest.author}</h4>
        </div>
      </div>
    </div>
  </div>
)

export default ContestDetail