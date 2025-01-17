interface IHelperTextProps {
  title: string;
  description: string;
}

export default function HelperText({ title, description }: IHelperTextProps) {
  return (
    <div className="flex flex-col rounded-sm bg-purple py-md px-lg text-gray-750">
      <h2 className="elytro-text-small-bold ">{title}</h2>
      <p className="elytro-text-tiny-body mt-2xs">{description}</p>
    </div>
  );
}
