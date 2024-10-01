export default function RatingFeedbackChart(props) {
    return (
        <div className="mt-4 bg-lbp dark:bg-dbp p-4 md:w-1/2 rounded shadow-md">
            <div className="text-sm text-lts flex items-center">
                <div className="grow">
                    Rating & Feedback
                </div>
                <div>{props.tag}</div>
            </div>
            <div className="mt-2 my-auto text-md ml-0.5 w-fit text-accent">
                {parseFloat(props.rating).toFixed(2)} / 5.00
            </div>
            <div className="flex text-sm flex-row flex-wrap mt-4">
                {props.feedbacks.map((x, index) => {
                    return (
                        <div key={`feedback-${index}`}
                             className="text-lts dark:text-dts m-1 ml-0 border border-dtp px-2 rounded-full">
                            {x}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}