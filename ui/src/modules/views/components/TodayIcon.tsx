import dayjs from "dayjs";

export default function CalendarIcon() {
  const date = dayjs().format("D");
  return (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      version="1.1"
    >
      <path
        d="M 19,3 H 18 V 1 H 16 V 3 H 8 V 1 H 6 V 3 H 5 C 3.89,3 3.01,3.9 3.01,5 L 3,19 c 0,1.1 0.89,2 2,2 h 14 c 1.1,0 2,-0.9 2,-2 V 5 C 21,3.9 20.1,3 19,3 m 0,16 H 5 V 8 h 14 z"
        id="path1"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Arial, sans-serif"
        id="text1"
      >
        {date}
      </text>
    </svg>
  );
}
