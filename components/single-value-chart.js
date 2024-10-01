import PctDirChange from "./pct-dir-change";

export default function SingleValueChart(props) {
  return (
    <div className={`mt-4 bg-lbp dark:bg-dbp p-4 rounded`}>
      <div className="text-sm text-lts dark:text-dts flex items-center">
        <div className="grow">
          {props.title}
          <br />
          <span className="opacity-70">{props.description}</span>
        </div>
        <div>{props.tag}</div>
      </div>
      <div className="flex mt-4 text-2xl">
        <div className="mr-2">
          {new Intl.NumberFormat("en-IN").format(props.data.value.toFixed(0))}
        </div>
        <PctDirChange pct_change={props.data.pct_change} />
      </div>
    </div>
  );
}
