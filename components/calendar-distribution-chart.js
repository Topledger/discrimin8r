import { useState } from "react";

export default function CalendarDistributionChart(props) {
  const [hoverLabel, setHoverLabel] = useState("Hover over boxes");
  const [activeHour, setActiveHour] = useState(undefined);
  const [activeValue, setActiveValue] = useState(undefined);

  function updateActiveHourValue(day, distributionItem) {
    if (!!distributionItem) {
      const hourString = distributionItem[0];
      const hour = +hourString % 24;
      setActiveHour((hour % 12 || 12) + " " + (hour < 12 ? "AM" : "PM"));
      setActiveValue(`${distributionItem[1]} %`);
      setHoverLabel(
        `${day} ${hours[distributionItem[0]]} ${distributionItem[1]}%`
      );
    } else {
      setHoverLabel("Hover over boxes");
      setActiveHour(undefined);
      setActiveValue(undefined);
    }
  }

  const hours = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="mt-4 bg-lbp dark:bg-dbp p-4 w-full rounded">
      <div className="text-sm text-lts dark:text-dts flex items-center">
        <span className="grow">{props.title}</span>
        <br />
        <div
          style={{
            transition: "all 0.5s",
          }}
        >
          <span className="uppercase rounded px-4 font-semibold text-white bg-[#58be46]">
            {hoverLabel}
          </span>
        </div>
      </div>
      <div className="overflow-auto mt-4">
        <table className="mx-auto mt-4 table-auto whitespace-nowrap">
          <tr>
            <td></td>
            {hours.map((x, index) => {
              return (
                <td
                  key={`hour-${index}`}
                  className="text-sm text-center mx-auto pb-2"
                >
                  {x}
                </td>
              );
            })}
          </tr>
          {days.map((day) => {
            return (
              <tr key={`day-${day}`}>
                <td className="text-right pr-4">{day}</td>
                {Object.entries(props.distribution[day]).map((x, index) => {
                  return (
                    <td key={`${day}-${index}`} className="pr-0">
                      <div
                        key={`dist-${props.title}-${index}`}
                        className="rounded-full w-8 h-4 m-1 hover:scale-125 hover:opacity-100"
                        style={{ transition: "all 0.1s" }}
                      >
                        <div
                          className="w-full h-full bg-accent hover:bg-[#58be46]"
                          style={{
                            opacity: `${0.1 + x[1] / 7}`,
                            borderRadius: "0.3rem",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.opacity = 1;
                            updateActiveHourValue(day, x);
                          }}
                          onMouseOut={(e) => {
                            e.target.style.opacity = 0.1 + x[1] / 7;
                            updateActiveHourValue(null, null);
                          }}
                        ></div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}
