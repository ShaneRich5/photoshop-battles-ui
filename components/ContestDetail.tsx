import { Contest } from "libs/contracts"
import PageTitle from "./PageTitle"

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
          <PageTitle>{contest.title}</PageTitle>
          <h4 className="text-base font-semibold leading-7 text-gray-700 sm:truncate">by {contest.author}</h4>
        </div>
      </div>
    </div>
  </div>
)

export default ContestDetail