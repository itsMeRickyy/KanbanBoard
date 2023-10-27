interface Props {
  labelTitle: string;
  count: number | string;
  bgColor: string;
  barColor: string;
  fontSize: string;
}

function TotalCard({labelTitle, count, bgColor, fontSize}: Props) {
  return (
    <div className={`${bgColor} w-32  rounded-2xl flex  justify-start items-center px-3 gap-2 shadow-xl`}>
      <h1 className="text-sm">{labelTitle}</h1>
      <h1 className={`${fontSize} font-bold`}>{count}</h1>
    </div>
  );
}

export default TotalCard;
