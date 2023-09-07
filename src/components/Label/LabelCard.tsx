interface Props {
  label: string;
  colorVariant: string;
}

function LabelCard({label, colorVariant}: Props) {
  return (
    <div className={`px-4  h-8 ${colorVariant} rounded-2xl flex justify-start items-center w-[50%]`}>
      <h1 className="font-bold  text-purple-900 ">{label}</h1>
    </div>
  );
}

export default LabelCard;
