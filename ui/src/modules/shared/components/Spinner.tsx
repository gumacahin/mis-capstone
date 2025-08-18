export default function Spinner() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(138, 21, 56)"
    >
      <circle cx="20" cy="50" r="10">
        <animate
          attributeName="r"
          from="10"
          to="10"
          begin="0s"
          dur="0.8s"
          values="10;20;10"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="50" r="10">
        <animate
          attributeName="r"
          from="10"
          to="10"
          begin="0.2s"
          dur="0.8s"
          values="10;20;10"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="80" cy="50" r="10">
        <animate
          attributeName="r"
          from="10"
          to="10"
          begin="0.4s"
          dur="0.8s"
          values="10;20;10"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
