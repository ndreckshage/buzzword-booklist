import cx from "classnames";

export default function CreatedBy({
  createdByType,
  createdBy,
}: {
  createdByType?: string;
  createdBy: string;
}) {
  return (
    <div className="flex space-x-1 items-center overflow-hidden text-ellipsis">
      {createdByType && <span>{createdByType} created by:</span>}
      <a
        href={`https://github.com/${createdBy}`}
        className={cx(
          "no-underline items-center flex border py-1 px-2 rounded-lg space-x-1",
          { "mx-2": createdByType }
        )}
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
