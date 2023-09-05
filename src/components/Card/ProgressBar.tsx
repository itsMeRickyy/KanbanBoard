interface Props {
  percentage: number;
  circleWidth: number;
}

function ProgressBar({percentage, circleWidth}: Props) {
  const radius = 85;
  return (
    <div>
      <svg width={circleWidth} height={circleWidth} viewBox={`0 0 ${circleWidth} ${circleWidth}`}>
        <circle cx={circleWidth / 2} cy={circleWidth / 2} r={radius} stroke="#ddd" strokeWidth={circleWidth / 2} fill="transparent" />
      </svg>
    </div>
  );
}

export default ProgressBar;
