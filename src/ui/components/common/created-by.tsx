export default function CreatedBy({
  createdByType,
  createdBy,
}: {
  createdByType: string;
  createdBy: string;
}) {
  return (
    <div className="flex space-x-1 items-center">
      <span>{createdByType} created by:</span>
      <a
        href={`https://github.com/${createdBy}`}
        className="no-underline items-center flex border py-1 px-2 mx-2 rounded-lg space-x-1"
        target="_blank"
      >
        <img
          src={`https://avatars.githubusercontent.com/${createdBy}?s=50`}
          className="rounded-full"
          width={25}
          height={25}
        />
        <span>{createdBy}</span>
      </a>
    </div>
  );
}
