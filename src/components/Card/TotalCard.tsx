interface Props {
  labelTitle: string;
  count: number | string;
  bgColor: string;
  barColor: string;
  fontSize: string;
}

function TotalCard({labelTitle, count, bgColor, barColor, fontSize}: Props) {
  return (
    <div className={`${bgColor} w-[110px] h-[85px] rounded-2xl flex flex-col justify-center items-start pl-5`}>
      <h1 className="text-sm">{labelTitle}</h1>
      <div className="flex gap-2 items-center">
        <div className={`${barColor} h-6 w-1  rounded-full`} />
        <h1 className={`${fontSize} font-bold`}>{count}</h1>
      </div>
    </div>
  );
}

export default TotalCard;
